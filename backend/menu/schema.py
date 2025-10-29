import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.core.exceptions import PermissionDenied
from .models import MenuItem
import graphene
from django.contrib.auth import get_user_model
from graphql_jwt.shortcuts import get_token
import graphql_jwt

# ------------------------------------------------------------
# 🔒 Helper de seguridad
# ------------------------------------------------------------
def require_permission(user, permission_codename):
    """
    Verifica si el usuario tiene el permiso requerido.
    Lanza error seguro si no lo tiene.
    """
    if not user.is_authenticated:
        raise GraphQLError("Acceso denegado: usuario no autenticado.")
    if not user.has_perm(permission_codename) and not user.is_superuser:
        raise GraphQLError("No tienes permiso para realizar esta acción.")


# ------------------------------------------------------------
# 🎯 Tipo GraphQL
# ------------------------------------------------------------
User = get_user_model()

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")
        
class PermissionType(graphene.ObjectType):
    id = graphene.Int()
    codename = graphene.String()
    name = graphene.String()
    app_label = graphene.String()

class MenuItemType(DjangoObjectType):
    has_children = graphene.Boolean()
    children = graphene.List(lambda: MenuItemType)
    required_permissions = graphene.List(PermissionType)  # <- NUEVO CAMPO

    class Meta:
        model = MenuItem
        fields = (
            'id',
            'title',
            'icon',
            'url',
            'parent',
            'order',
            'is_active',
            'notification_count',
            'created_at',
            'updated_at',
        )

    def resolve_has_children(self, info):
        return self.has_children()

    def resolve_children(self, info):
        user = info.context.user
        return [child for child in self.children.filter(is_active=True) if child.user_has_access(user)]

    def resolve_has_children(self, info):
        return self.has_children()

    def resolve_children(self, info):
        user = info.context.user
        # Filtramos solo hijos visibles al usuario
        return [child for child in self.children.filter(is_active=True) if child.user_has_access(user)]
    
    def resolve_required_permissions(self, info):
        """
        Devuelve los permisos asociados al menú.
        """
        return [
            PermissionType(
                id=perm.id,
                codename=perm.codename,
                name=perm.name,
                app_label=perm.content_type.app_label
            )
            for perm in self.required_permissions.all()
        ]
        


# ------------------------------------------------------------
# 🔍 Query con control de acceso
# ------------------------------------------------------------
class Query(graphene.ObjectType):
    all_menu_items = graphene.List(MenuItemType)
    root_menu_items = graphene.List(MenuItemType)
    menu_item = graphene.Field(MenuItemType, id=graphene.Int())
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError("No autenticado.")
        return user

    def resolve_all_menu_items(self, info):
        """
        Obtiene todos los elementos del menú accesibles al usuario actual.
        """
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError("Autenticación requerida.")
        items = MenuItem.objects.filter(is_active=True)
        return [item for item in items if item.user_has_access(user)]

    def resolve_root_menu_items(self, info):
        """
        Obtiene solo los elementos raíz accesibles al usuario actual.
        """
        user = info.context.user
        if not user.is_authenticated:
            raise GraphQLError("Autenticación requerida.")
        roots = MenuItem.objects.filter(parent__isnull=True, is_active=True)
        return [item for item in roots if item.user_has_access(user)]

    def resolve_menu_item(self, info, id):
        """
        Obtiene un elemento específico por ID, validando acceso.
        """
        user = info.context.user
        menu_item = MenuItem.objects.get(pk=id, is_active=True)
        if not menu_item.user_has_access(user):
            raise GraphQLError("No tienes permiso para acceder a este menú.")
        return menu_item
    

# ------------------------------------------------------------
# ✏️ Mutaciones seguras
# ------------------------------------------------------------
class CreateMenuItem(graphene.Mutation):
    menu_item = graphene.Field(MenuItemType)

    class Arguments:
        title = graphene.String(required=True)
        icon = graphene.String()
        url = graphene.String()
        parent_id = graphene.Int()
        order = graphene.Int()
        notification_count = graphene.Int()

    def mutate(self, info, title, icon=None, url=None, parent_id=None, order=0, notification_count=0):
        user = info.context.user
        # 🔒 Solo usuarios con permiso pueden crear menús
        require_permission(user, "menu.add_menuitem")

        parent = None
        if parent_id:
            parent = MenuItem.objects.get(pk=parent_id)

        menu_item = MenuItem.objects.create(
            title=title,
            icon=icon,
            url=url,
            parent=parent,
            order=order,
            notification_count=notification_count,
        )

        return CreateMenuItem(menu_item=menu_item)


class UpdateMenuItem(graphene.Mutation):
    menu_item = graphene.Field(MenuItemType)

    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        icon = graphene.String()
        url = graphene.String()
        notification_count = graphene.Int()

    def mutate(self, info, id, title=None, icon=None, url=None, notification_count=None):
        user = info.context.user
        require_permission(user, "menu.change_menuitem")

        menu_item = MenuItem.objects.get(pk=id)

        if title:
            menu_item.title = title
        if icon:
            menu_item.icon = icon
        if url:
            menu_item.url = url
        if notification_count is not None:
            menu_item.notification_count = notification_count

        menu_item.save()
        return UpdateMenuItem(menu_item=menu_item)


class DeleteMenuItem(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        user = info.context.user
        require_permission(user, "menu.delete_menuitem")

        try:
            MenuItem.objects.get(pk=id).delete()
            return DeleteMenuItem(success=True)
        except MenuItem.DoesNotExist:
            raise GraphQLError("El elemento no existe.")


# ------------------------------------------------------------
# 🔗 Registro del esquema
# ------------------------------------------------------------
class Mutation(graphene.ObjectType):
    create_menu_item = CreateMenuItem.Field()
    update_menu_item = UpdateMenuItem.Field()
    delete_menu_item = DeleteMenuItem.Field()
    
    # 🔒 Mutaciones JWT
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
