(() => {
    'use strict';
  
    const React = window.React;
    const RichUtils = window.DraftJS.RichUtils;

    const TooltipEntity = window.draftail.TooltipEntity;

    const $ = global.jQuery;

    class ReferenceModalWorkflow extends React.Component {    
        componentDidMount() {
            const { onClose, entityType, entity, editorState } = this.props;
            const { url, urlParams, onload } = {
                url: global.chooserUrls.referenceChooser,
                urlParams: {},
                onload: global.REFERENCE_CHOOSER_MODAL_ONLOAD_HANDLERS,
              };
            
            // eslint-disable-next-line new-cap
            global.ModalWorkflow({
                url,
                urlParams,
                onload,
                responses: {
                    referenceChosen: (data) => {
                        const { editorState, entityType, onComplete } = this.props;
                        
                        const content = editorState.getCurrentContent();

                        // This is very basic – we do not even support editing existing anchors.
                        const fragment = data;

                        // Uses the Draft.js API to create a new entity with the right data.
                        const contentWithEntity = content.createEntity(
                            entityType.type,
                            'MUTABLE',
                            {
                                fragment: fragment,
                            },
                        );
                        
                        const entityKey = contentWithEntity.getLastCreatedEntityKey();
                        const selection = editorState.getSelection();
                        const nextState = RichUtils.toggleLink(
                            editorState,
                            selection,
                            entityKey,
                        );

                        onComplete(nextState);
                    }
                },
                onError: () => {
                // eslint-disable-next-line no-alert
                    window.alert(global.wagtailConfig.STRINGS.SERVER_ERROR);
                onClose();
                },
            });

        }

        onClose(e) {
            const { onClose } = this.props;
            window.alert("something got chosen");
            e.preventDefault();
      
            onClose();
          }

        render() {
            return null;
        }
    }

    const ReferenceLink = props => {
        const { entityKey, contentState } = props;
        const data = contentState.getEntity(entityKey).getData();

        let label = ''
        
        if(data.fragment) {
            label = data.fragment.slug || '';
        }

        let icon = React.createElement(window.wagtail.components.Icon, {name: 'openquote'});
    
        return React.createElement(TooltipEntity, {
            entityKey: props.entityKey,
            children: props.children,
            onEdit: props.onEdit,
            onRemove: props.onRemove,
            icon: icon,
            label: label
          });
    };

    window.draftail.registerPlugin({
        type: 'REFERENCE',
        source: ReferenceModalWorkflow,
        decorator: ReferenceLink,
    });
})();