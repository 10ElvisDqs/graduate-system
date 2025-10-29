from django import forms
from django.apps import apps
from django.contrib.auth.models import Permission
from .models import MenuItem

class MenuItemAdminForm(forms.ModelForm):
    app_association = forms.ChoiceField(
        label="Aplicación",
        required=False,
    )

    class Meta:
        model = MenuItem
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Crear las opciones dinámicas del select de aplicaciones
        app_choices = [(app.label, app.verbose_name.title()) for app in apps.get_app_configs()]
        app_choices.insert(0, ('', '---------'))
        self.fields['app_association'].choices = app_choices

        # Si ya existe una app seleccionada, cargar sus permisos
        if self.instance and self.instance.app_association:
            self.fields['required_permissions'].queryset = Permission.objects.filter(
                content_type__app_label=self.instance.app_association
            )
        else:
            self.fields['required_permissions'].queryset = Permission.objects.all()

    def clean(self):
        """
        Cuando se selecciona una app, asignar automáticamente sus permisos.
        """
        cleaned_data = super().clean()
        app_label = cleaned_data.get('app_association')

        if app_label:
            # Buscar permisos de esa app
            perms = Permission.objects.filter(content_type__app_label=app_label)
            cleaned_data['required_permissions'] = perms

        return cleaned_data
