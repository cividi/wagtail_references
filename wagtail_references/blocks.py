from django.utils.functional import cached_property

# from wagtail.core.blocks import ChooserBlock
from wagtail.snippets.blocks import SnippetChooserBlock

# from .shortcuts import get_rendition_or_not_found


class ReferenceChooserBlock(SnippetChooserBlock):
    @cached_property
    def target_model(self):
        from wagtail_references import get_reference_model
        return get_reference_model()

    # def render_basic(self, value, context=None):
    #     if value:
    #                 return get_rendition_or_not_found(value, 'original').img_tag()
    #             else:
    #         return ''

    class Meta:
        icon = "openquote"
