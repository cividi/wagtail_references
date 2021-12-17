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
    return DOM.create_element('a', {
        "linktype": "reference",
        "id": props.get("id"),
        "data-string": props.get("string"),
        "data-edit-link": props.get("edit_link"),
    }, props['children'])

class ReferenceLinkHandler(LinkHandler):
    identifier = "reference"

    @classmethod
    def get_instance(cls, attrs):
        model = get_reference_model()
        return model.objects.get(id=attrs["id"])

    @classmethod
    def get_template(cls, attrs):
        return "wagtail_references/reference_snippet_link.html"

    @classmethod
    def expand_db_attributes(cls, attrs):
        try:
            reference_obj = cls.get_instance(attrs)
            template = cls.get_template(attrs)
            return render_to_string(template, {"object": reference_obj})
        except Exception:
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
            "id": attrs.get("id"),
            "string": attrs.get("data-string"),
            "edit_link": attrs.get("data-edit-link"),
        }