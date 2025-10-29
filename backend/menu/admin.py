from django.contrib import admin
from django.contrib.auth.models import Permission

from .forms import MenuItemAdminForm
from .models import MenuItem

from django.apps import apps
from django.contrib.auth.models import Permission, ContentType

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    """Asignar formulario personalizado"""
    form = MenuItemAdminForm
    """
    Admin para MenuItem con control de permisos y estructura jerárquica.
    """
    list_display = (
        'title','parent','order','is_active','notification_count','has_children_display','display_permissions','app_association',
    )
    
    list_filter = ('is_active', 'parent', 'required_permissions')
    search_fields = ('title', 'url', 'required_permissions__codename')
    ordering = ('order', 'title')
    filter_horizontal = ('required_permissions',)

    readonly_fields = ('created_at', 'updated_at')

    fieldsets = (
        ("🧩 Información del Menú", {
            "fields": (
                'title','icon','url','parent','order','is_active','notification_count','app_association',
            )
        }),
        ("🔐 Control de Acceso", {
            "fields": ('required_permissions',),
            "classes": ('collapse',),
            "description": "Selecciona los permisos necesarios para acceder a este menú. "
                           "Si no se asignan, el menú será público."
        }),
        ("⏱ Fechas de Registro", {
            "fields": ('created_at', 'updated_at'),
            "classes": ('collapse',),
        }),
    )
    
    # --- Métodos auxiliares ---
    def has_children_display(self, obj):
        """Muestra si el menú tiene submenús."""
        return obj.has_children()
    has_children_display.boolean = True
    has_children_display.short_description = 'Tiene hijos'

    def display_permissions(self, obj):
        """Muestra los permisos requeridos en forma legible."""
        if not obj.required_permissions.exists():
            return "Público"
        return ", ".join([perm.codename for perm in obj.required_permissions.all()])
    display_permissions.short_description = 'Permisos requeridos'

    def get_queryset(self, request):
        """Optimiza las consultas usando prefetch de permisos y relaciones."""
        qs = super().get_queryset(request)
        return qs.prefetch_related('required_permissions', 'parent', 'children')
    def save_model(self, request, obj, form, change):
        """
        Asigna automáticamente los permisos de la aplicación seleccionada
        solo si el registro es nuevo o si cambió la app asociada.
        """
        super().save_model(request, obj, form, change)

        app_label = form.cleaned_data.get('app_association')

        if app_label:
            # Solo reasignar si es nuevo o cambió la app
            if not change or (obj.app_association != form.initial.get('app_association')):
                permissions = Permission.objects.filter(content_type__app_label=app_label)
                obj.required_permissions.set(permissions)
                self.message_user(
                    request,
                    f"✅ Se asignaron automáticamente los permisos de la aplicación '{app_label}'."
                )
        else:
            # Si no tiene app seleccionada y es nuevo, limpiar permisos
            if not change:
                obj.required_permissions.clear()



@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    """Admin simple para permisos de Django."""
    list_display = ('codename', 'name', 'content_type')
    search_fields = ('codename', 'name')
    list_filter = ('content_type',)
