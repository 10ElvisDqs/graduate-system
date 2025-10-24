from django.core.management.base import BaseCommand
from menu.models import MenuItem

class Command(BaseCommand):
    help = 'Seed the database with sample menu items'

    def handle(self, *args, **kwargs):
        # Limpiar datos existentes
        MenuItem.objects.all().delete()
        
        # Dashboard
        dashboard = MenuItem.objects.create(
            title='Dashboard',
            icon='bi-speedometer2',
            url='/dashboard',
            order=1,
            notification_count=0
        )
        
        # Getting Started (con hijos)
        getting_started = MenuItem.objects.create(
            title='Getting Started',
            icon='bi-rocket-takeoff',
            order=2
        )
        MenuItem.objects.create(
            title='Supported Frameworks',
            icon='bi-layers',
            url='/frameworks',
            parent=getting_started,
            order=1
        )
        MenuItem.objects.create(
            title='Incremental Migration',
            icon='bi-arrow-repeat',
            url='/migration',
            parent=getting_started,
            order=2
        )
        MenuItem.objects.create(
            title='Production Checklist',
            icon='bi-check-circle',
            url='/checklist',
            parent=getting_started,
            order=3,
            notification_count=3
        )
        
        # Access (con hijos)
        access = MenuItem.objects.create(
            title='Access',
            icon='bi-shield-lock',
            order=3
        )
        MenuItem.objects.create(
            title='AI',
            icon='bi-cpu',
            url='/ai',
            parent=access,
            order=1
        )
        MenuItem.objects.create(
            title='API',
            icon='bi-code-slash',
            url='/api',
            parent=access,
            order=2
        )
        MenuItem.objects.create(
            title='Build & Deploy',
            icon='bi-hammer',
            url='/build',
            parent=access,
            order=3
        )
        
        # Projects
        projects = MenuItem.objects.create(
            title='Projects',
            icon='bi-folder',
            url='/projects',
            order=4,
            notification_count=5
        )
        
        # Settings (con hijos anidados)
        settings = MenuItem.objects.create(
            title='Settings',
            icon='bi-gear',
            order=5
        )
        
        general = MenuItem.objects.create(
            title='General',
            icon='bi-sliders',
            url='/settings/general',
            parent=settings,
            order=1
        )
        
        security = MenuItem.objects.create(
            title='Security',
            icon='bi-lock',
            parent=settings,
            order=2
        )
        MenuItem.objects.create(
            title='Authentication',
            icon='bi-key',
            url='/settings/security/auth',
            parent=security,
            order=1
        )
        MenuItem.objects.create(
            title='Permissions',
            icon='bi-person-check',
            url='/settings/security/permissions',
            parent=security,
            order=2
        )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded menu items'))
