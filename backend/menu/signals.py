from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Permission, ContentType
from django.apps import apps
from menu.models import MenuItem

@receiver(post_save, sender=MenuItem)
def auto_assign_app_permissions(sender, instance, created, **kwargs):
    """
    Cuando se asigne una app_association, se agregan automáticamente
    los permisos add/change/delete/view a required_permissions.
    """
    if not instance.app_association:
        return  # No hay app asociada, no hacemos nada

    try:
        app_label = instance.app_association.strip().lower()
        models_in_app = apps.get_app_config(app_label).get_models()

        for model in models_in_app:
            # Obtenemos el ContentType del modelo
            ct = ContentType.objects.get_for_model(model)
            # Buscamos los permisos base
            perms = Permission.objects.filter(content_type=ct, codename__in=[
                f'add_{model._meta.model_name}',
                f'change_{model._meta.model_name}',
                f'delete_{model._meta.model_name}',
                f'view_{model._meta.model_name}'
            ])
            # Agregamos los permisos al menú
            if perms.exists():
                instance.required_permissions.add(*perms)

    except LookupError:
        print(f"⚠️ App '{instance.app_association}' no encontrada.")
    except Exception as e:
        print(f"⚠️ Error asignando permisos: {e}")
