from draftjs_exporter.dom import DOM
from wagtail.admin.rich_text.converters.html_to_contentstate import InlineEntityElementHandler

def reference_entity_decorator(props):
    """
    Draft.js ContentState to database HTML.
    Converts the REFERENCE entities into a span tag.
    """
    return DOM.create_element('span', {
        'data-reference': props['reference'],
    }, props['children'])


class ReferenceEntityElementHandler(InlineEntityElementHandler):
    """
    Database HTML to Draft.js ContentState.
    Converts the span tag into a REFERENCE entity, with the right data.
    """
    mutability = 'IMMUTABLE'

    def get_attribute_data(self, attrs):
        """
        Take the ``reference`` value from the ``data-reference`` HTML attribute.
        """
        return {
            'reference': attrs['data-reference'],
        }