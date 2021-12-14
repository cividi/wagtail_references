(() => {
    'use strict';
  
    const React = window.React;
    const Modifier = window.DraftJS.Modifier;
    const AtomicBlockUtils = window.DraftJS.AtomicBlockUtils;
    const RichUtils = window.DraftJS.RichUtils;
    const EditorState = window.DraftJS.EditorState;
  
    const TooltipEntity = window.draftail.TooltipEntity;
  
    const $ = global.jQuery;
  
    const filterSnippetEntityData = (data) => {
      return {
        slug: data.slug,
        id: data.id
      };
    };
  
    /**
     * Interfaces with Wagtail's ModalWorkflow to open the chooser,
     * and create new content in Draft.js based on the data.
     */
    class ReferenceModalWorkflowSource extends React.Component {
      constructor(props) {
        super(props);
  
        this.onChosen = this.onChosen.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.onModelChosen = this.onModelChosen.bind(this);
      }
  
      componentDidMount() {
        const { editorState, onComplete, entityType, entity } = this.props;
        const { url, urlParams, onload } = {
            url: global.chooserUrls.referenceChooser,
            urlParams: {},
          };
      }
  
      onModelChosen(snippetModelMeta) {
        window.snippetModelMeta = snippetModelMeta;
        const { url, urlParams, onload } = {
            url: global.chooserUrls.snippetChooser.concat('wagtail_references/reference/'),
            urlParams: {},
            onload: global.SNIPPET_CHOOSER_MODAL_ONLOAD_HANDLERS,
          };;
  
        this.model_workflow.close();
  
        // eslint-disable-next-line new-cap
        this.workflow = global.ModalWorkflow({
          url,
          urlParams,
          onload,
          responses: {
            snippetChosen: this.onChosen,
          },
          onError: () => {
            // eslint-disable-next-line no-alert
            window.alert(global.wagtailConfig.STRINGS.SERVER_ERROR);
            onComplete();
          },
        });
      }
  
      onChosen(data) {
        const { editorState, entityType, onComplete } = this.props;
        const content = editorState.getCurrentContent();
        const selection = editorState.getSelection();
  
        const entityData = filterSnippetEntityData(data);
        const mutability = "IMMUTABLE";
        const contentWithEntity = content.createEntity(entityType.type, mutability, entityData);
        const entityKey = contentWithEntity.getLastCreatedEntityKey();
  
        let nextState;
  
        // If there is a title attribute, use it. Otherwise we inject the URL.
        const newText = data.string;
        const newContent = Modifier.replaceText(content, selection, newText, null, entityKey);
        nextState = EditorState.push(editorState, newContent, 'insert-characters');
  
        onComplete(nextState);
      }
  
      onComplete(e) {
        const { onComplete } = this.props;
        e.preventDefault();
  
        onComplete();
      }
  
      render() {
        return null;
      }
    }
  
    const Reference = props => {
      const { entityKey, contentState } = props;
      const data = contentState.getEntity(entityKey).getData();
  
      return React.createElement('a[linktype="reference"]', {
        role: 'button'
      }, props.children);
    };
  
    window.draftail.registerPlugin({
      type: 'SNIPPET',
      source: ReferenceModalWorkflowSource,
      decorator: Reference,
    });
  })();
  