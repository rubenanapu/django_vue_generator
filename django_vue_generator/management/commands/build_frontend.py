from django.core.management.base import BaseCommand
from django.core import management

from django_vue_generator.utils import (
    cd_back,
    fail,
    set_yarn_path,
    UI_DESTINATION
)


class Command(BaseCommand):
    help = "Build frontend"

    def handle(self, *args, **options):
        set_yarn_path()
        with cd_back(UI_DESTINATION):
            fail("yarn build")

        management.call_command("collectstatic", '--no-input')
