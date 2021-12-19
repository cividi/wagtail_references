from wagtail.core.blocks.field_block import RichTextBlock
from wagtail.core.models import Page
from wagtail.core.fields import RichTextField, StreamField
from wagtail.core.blocks import RichTextBlock
from wagtail.admin.edit_handlers import FieldPanel

from wagtail_references.blocks import ReferenceChooserBlock

from grapple.models import GraphQLStreamfield

class BlogPage(Page):
    body = RichTextField()
    bib_reference = StreamField([
        ('ref', ReferenceChooserBlock(target_model="wagtail_references.reference")),
        ('richtext', RichTextBlock()),
    ], blank=True)

    graphql_fields = [
        GraphQLStreamfield("body"),
        GraphQLStreamfield("bib_reference"),
    ]

    content_panels = Page.content_panels + [
        FieldPanel('body', classname="full"),
        FieldPanel('bib_reference'),
    ]

