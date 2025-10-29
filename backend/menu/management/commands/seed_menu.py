from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission, ContentType
from menu.models import MenuItem

class Command(BaseCommand):
    help = 'Seed basic sidebar items'

    def handle(self, *args, **kwargs):
        # Limpiar datos existentes
        MenuItem.objects.all().delete()

        # Obtener permisos base
        content_type = ContentType.objects.get_for_model(MenuItem)
        add_perm = Permission.objects.get(codename='add_menuitem', content_type=content_type)
        change_perm = Permission.objects.get(codename='change_menuitem', content_type=content_type)

        # Helper para crear items
        def create_item(title, icon, url=None, parent=None, order=0, perms=[]):
            item = MenuItem.objects.create(
                title=title,
                icon=icon,
                url=url,
                parent=parent,
                order=order
            )
            if perms:
                item.required_permissions.add(*perms)
            return item

        # 🔹 Rutas principales
        inicio = create_item("Inicio", "bi-house", url="/postgrado/", order=1)
        perfil = create_item("Perfil", "bi-person", url="/postgrado/perfil", order=2)

        # 🔹 Académico con hijos
        academico = create_item("Académico", "bi-book", order=3)
        create_item("Entidad Académica", "bi-people", url="/postgrado/entidades-academicas", parent=academico, order=1)
        create_item("Planes Formación", "bi-journal", url="/postgrado/planes-formacion", parent=academico, order=2)
        create_item("Materias", "bi-journal-text", url="/postgrado/materias", parent=academico, order=3)

        # 🔹 Estudiantes con hijos
        estudiantes = create_item("Estudiantes", "bi-people-fill", order=4)
        create_item("Vencimiento Plan", "bi-calendar-check", url="/postgrado/vencimiento-plan", parent=estudiantes, order=1)
        create_item("Certificado de Notas", "bi-file-earmark-text", url="/postgrado/certificado-notas", parent=estudiantes, order=2)
        create_item("Fichas Datos Personales", "bi-person-lines-fill", url="/postgrado/fichas", parent=estudiantes, order=3)

        self.stdout.write(self.style.SUCCESS("Sidebar items seeded successfully!"))
