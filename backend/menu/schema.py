import graphene
from graphene_django import DjangoObjectType
from .models import MenuItem

class MenuItemType(DjangoObjectType):
    """
    Tipo GraphQL para MenuItem con soporte para estructura jerárquica
    """
    has_children = graphene.Boolean()
    children = graphene.List(lambda: MenuItemType)
    
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
            'updated_at'
        )

    def resolve_has_children(self, info):
        return self.has_children()

    def resolve_children(self, info):
        return self.children.filter(is_active=True)


class Query(graphene.ObjectType):
    all_menu_items = graphene.List(MenuItemType)
    root_menu_items = graphene.List(MenuItemType)
    menu_item = graphene.Field(MenuItemType, id=graphene.Int())
    
    def resolve_all_menu_items(self, info):
        """Obtiene todos los elementos del menú"""
        return MenuItem.objects.filter(is_active=True)
    
    def resolve_root_menu_items(self, info):
        """Obtiene solo los elementos raíz (sin padre)"""
        return MenuItem.objects.filter(parent__isnull=True, is_active=True)
    
    def resolve_menu_item(self, info, id):
        """Obtiene un elemento específico por ID"""
        return MenuItem.objects.get(pk=id, is_active=True)


class CreateMenuItem(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        icon = graphene.String()
        url = graphene.String()
        parent_id = graphene.Int()
        order = graphene.Int()
        notification_count = graphene.Int()

    menu_item = graphene.Field(MenuItemType)

    def mutate(self, info, title, icon=None, url=None, parent_id=None, order=0, notification_count=0):
        parent = None
        if parent_id:
            parent = MenuItem.objects.get(pk=parent_id)
        
        menu_item = MenuItem.objects.create(
            title=title,
            icon=icon,
            url=url,
            parent=parent,
            order=order,
            notification_count=notification_count
        )
        return CreateMenuItem(menu_item=menu_item)


class UpdateMenuItem(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        icon = graphene.String()
        url = graphene.String()
        notification_count = graphene.Int()

    menu_item = graphene.Field(MenuItemType)

    def mutate(self, info, id, title=None, icon=None, url=None, notification_count=None):
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


class Mutation(graphene.ObjectType):
    create_menu_item = CreateMenuItem.Field()
    update_menu_item = UpdateMenuItem.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
