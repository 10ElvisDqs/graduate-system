from django.db import models
from django.contrib.auth.models import Permission


class MenuItem(models.Model):
    """
    Modelo que representa un elemento del menú usando el patrón Composite.
    Incluye control de acceso basado en permisos de Django.
    """
    title = models.CharField(max_length=200)
    icon = models.CharField(max_length=50, blank=True, null=True)
    url = models.CharField(max_length=500, blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children'
    )
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    notification_count = models.IntegerField(default=0)

    # Permisos nativos de Django
    required_permissions = models.ManyToManyField(Permission, blank=True, related_name='menu_items', help_text="Permisos necesarios para acceder a este elemento del menú.")
    app_association = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Menu Item'
        verbose_name_plural = 'Menu Items'

    def __str__(self):
        return self.title

    # --- 🔽 MÉTODOS DE UTILIDAD SEGURA ---

    def has_children(self):
        """Verifica si el elemento tiene hijos (patrón Composite)"""
        return self.children.exists()

    def get_all_children(self):
        """Obtiene todos los hijos recursivamente"""
        children = []
        for child in self.children.all():
            children.append(child)
            children.extend(child.get_all_children())
        return children

    def user_has_access(self, user):
        """
        Verifica si el usuario tiene permiso para acceder al menú.
        Un menú sin permisos asignados se considera público.
        """
        # Si el menú está inactivo, nadie lo ve
        if not self.is_active:
            return False

        # Si no hay permisos requeridos, es público
        if not self.required_permissions.exists():
            return True

        # Superusuarios tienen acceso total
        if user.is_superuser:
            return True

        # Verificar si el usuario posee TODOS los permisos requeridos
        for perm in self.required_permissions.all():
            full_code = f"{perm.content_type.app_label}.{perm.codename}"
            if not user.has_perm(full_code):
                return False

        return True
