from wagtail.core.models import Page
from wagtail.core.fields import RichTextField, StreamField
from wagtail.admin.edit_handlers import FieldPanel

from wagtail_references.blocks import ReferenceChooserBlock

class BlogPage(Page):
    body = RichTextField()
    bib_reference = StreamField([
        ('ref', ReferenceChooserBlock(target_model="wagtail_references.reference")),
    ], blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full"),
        FieldPanel('bib_reference'),
    ]

