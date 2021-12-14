from django.apps import apps
from django.template.loader import render_to_string

from draftjs_exporter.dom import DOM
from wagtail.admin.rich_text.converters.html_to_contentstate import InlineEntityElementHandler

from wagtail_references import get_reference_model

# Front-end conversion
class SnippetRefHandler(InlineEntityElementHandler):
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
            snippet_obj = cls.get_instance(attrs)
            template = cls.get_template(attrs)
            return render_to_string(template, {"object": snippet_obj})
        except Exception:
            return "<a>"


# draft.js / contentstate conversion
def reference_entity_decorator(props):
    """
    Helper to construct elements of the form
    <a id="1" linktype="reference">snippet link</a>
    when converting from contentstate data
    """

    # props["children"] defaults to the string representation of the model if it's missing
    selected_text = props["children"]

    return DOM.create_element('a[linktype="reference"]', {
        'data-slug': props['slug'],
    }, props['children'])
