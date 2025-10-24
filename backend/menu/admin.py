from django.contrib import admin
from .models import MenuItem

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'parent', 'order', 'is_active', 'notification_count', 'has_children')
    list_filter = ('is_active', 'parent')
    search_fields = ('title', 'url')
    ordering = ('order', 'title')
    
    def has_children(self, obj):
        return obj.has_children()
    has_children.boolean = True
    has_children.short_description = 'Has Children'