from django.apps import apps
from django.template.loader import render_to_string

from draftjs_exporter.dom import DOM
from wagtail.admin.rich_text.converters.html_to_contentstate import LinkElementHandler
from wagtail.core.rich_text import LinkHandler

from wagtail_references import get_reference_model

def reference_entity_decorator(props):
    """
    Draft.js ContentState to database HTML.
    Converts the REFERENCE entities into a span tag.
    """
    fragment = props.get("fragment")
    
    return DOM.create_element('a', {
        "linktype": "reference",
        "data-id": fragment.get("id"),
        "data-slug": fragment.get("slug"),
    }, props['children'])

class ReferenceLinkHandler(LinkHandler):
    identifier = "reference"

    @staticmethod
    def get_model():
        return get_reference_model()
    @classmethod
    def get_instance(cls, attrs):
        model = cls.get_model()
        return model.objects.get(id=attrs["data-id"])

    @classmethod
    def get_template(cls, attrs):
        return "wagtail_references/reference_snippet_link.html"

    @classmethod
    def expand_db_attributes(cls, attrs):
        try:
            reference_obj = cls.get_instance(attrs)
            template = cls.get_template(attrs)
            return render_to_string(template, {"object": reference_obj})
        except Exception as e:
            return "<a>"

class ReferenceEntityElementHandler(LinkElementHandler):
    """
    Database HTML to Draft.js ContentState.
    Converts the a tag into a REFERENCE entity, with the right data.
    """
    mutability = 'MUTABLE'

    def get_attribute_data(self, attrs):
        """
        Take the ``reference`` value from the ``data-reference`` HTML attribute.
        """
        return {
            "fragment": {
                "id": attrs.get("data-id"),
                "slug": attrs.get("data-slug"),
            }
        }