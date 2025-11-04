from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission, ContentType
from menu.models import MenuItem
import sys

class Command(BaseCommand):
    help = 'Seed basic sidebar items based on the provided image'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting menu seeding process...")
        
        # Limpiar datos existentes
        try:
            MenuItem.objects.all().delete()
            self.stdout.write("Cleared existing menu items.")
        except Exception as e:
            self.stderr.write(f"Error clearing menu items: {e}")
            return

        # --- Obtener permisos (opcional, basado en tu script) ---
        # Nos aseguramos que los content types existan antes de buscarlos
        try:
            content_type = ContentType.objects.get_for_model(MenuItem)
            add_perm = Permission.objects.get(codename='add_menuitem', content_type=content_type)
            change_perm = Permission.objects.get(codename='change_menuitem', content_type=content_type)
            self.stdout.write("Permissions loaded (though not used in this seed).")
        except ContentType.DoesNotExist:
            self.stderr.write(self.style.ERROR(
                "Error: ContentType for MenuItem does not exist. "
                "Did you run `manage.py migrate` for the 'menu' app?"
            ))
            sys.exit(1)
        except Permission.DoesNotExist:
            self.stderr.write(self.style.WARNING(
                "Warning: Base permissions for MenuItem not found. "
                "This might be normal if you haven't defined them."
            ))
        except Exception as e:
            self.stderr.write(f"An error occurred loading permissions: {e}")
            

        # --- Helper para crear items ---
        def create_item(title, icon, url=None, parent=None, order=0, perms=[]):
            item = MenuItem.objects.create(
                title=title,
                icon=icon,
                url=url,
                parent=parent,
                order=order
            )
            if perms:
                print(f'perms: {perms}')
                item.required_permissions.add(*perms)
            return item

        self.stdout.write("Creating menu items...")

        try:
            # 🔹 Raíz Principal "Postgrado"
            # Este es ahora el único ítem raíz
            postgrado = create_item("Postgrado", "bi-mortarboard-fill", url="/postgrado", order=1)

            # 🔹 Rutas principales (ahora hijas de Postgrado)
            inicio = create_item("Inicio", "bi-house", url="/postgrado/inicio", parent=postgrado, order=1)
            perfil = create_item("Perfil", "bi-person", url="/postgrado/perfil", parent=postgrado, order=2)

            # 🔹 Académico con hijos (ahora hijo de Postgrado)
            academico = create_item("Académico", "bi-book", parent=postgrado, order=3)
            # Los hijos de 'academico' no cambian, siguen siendo hijos de 'academico'
            create_item("Entidad Académica", "bi-people", url="/postgrado/entidades-academicas", parent=academico, order=1)
            create_item("Planes Formación", "bi-journal", url="/postgrado/planes-formacion", parent=academico, order=2)
            create_item("Materias", "bi-journal-text", url="/postgrado/materias", parent=academico, order=3)
            create_item("Oferta de Carreras", "bi-collection", url="/postgrado/oferta-carrera", parent=academico, order=4)
            create_item("Nivel Formación", "bi-layers", url="/postgrado/nivel-formacion", parent=academico, order=5)
            create_item("Convenio", "bi-briefcase", url="/postgrado/convenio", parent=academico, order=6)
            create_item("Oferta Edición", "bi-calendar-event", url="/postgrado/oferta-edicion", parent=academico, order=7)
            create_item("Oferta Modulo", "bi-book-half", url="/postgrado/oferta-modulo", parent=academico, order=8)
            create_item("Entidad Externa", "bi-building", url="/postgrado/entidad-externa", parent=academico, order=9)
            create_item("Horario", "bi-calendar-week", url="/postgrado/horario_modulos", parent=academico, order=10)
            create_item("Matricula", "bi-person-check", url="/postgrado/matricula", parent=academico, order=11)
            
            # 🔹 Estudiantes con hijos (ahora hijo de Postgrado)
            estudiantes = create_item("Estudiantes", "bi-people-fill", parent=postgrado, order=4)
            # Los hijos de 'estudiantes' no cambian
            create_item("Vencimiento Plan", "bi-calendar-check", url="/postgrado/vencimiento-plan", parent=estudiantes, order=1)
            create_item("Certificado de Notas", "bi-file-earmark-text", url="/postgrado/certificado-notas", parent=estudiantes, order=2)
            create_item("Fichas Datos Personales", "bi-person-lines-fill", url="/postgrado/fichas", parent=estudiantes, order=3)

            self.stdout.write(self.style.SUCCESS("Sidebar items seeded successfully!"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"An error occurred while creating menu items: {e}"))
            self.stderr.write(self.style.ERROR("Seeding failed. Rolling back is not automatic. Please check your database."))

