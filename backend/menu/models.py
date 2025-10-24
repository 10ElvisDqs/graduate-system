from django.db import models

class MenuItem(models.Model):
    """
    Modelo que representa un elemento del menú usando el patrón Composite.
    Puede ser un elemento simple o un contenedor de otros elementos.
    """
    title = models.CharField(max_length=200)
    icon = models.CharField(max_length=50, blank=True, null=True)
    url = models.CharField(max_length=500, blank=True, null=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    notification_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Menu Item'
        verbose_name_plural = 'Menu Items'

    def __str__(self):
        return self.title

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
