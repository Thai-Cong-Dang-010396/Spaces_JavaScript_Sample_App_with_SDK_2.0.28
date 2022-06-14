import Quill from 'quill';

const Parchment = Quill.import('parchment');

class MentionBlot extends Parchment.Embed {
  static create(data) {
    const domNode = super.create(data);

    domNode.removeAttribute('autocapitalize');
    domNode.removeAttribute('autocomplete');
    domNode.removeAttribute('autocorrect');
    domNode.removeAttribute('spellcheck');
    domNode.setAttribute('id', data.id);
    domNode.setAttribute('type', data.type);
    domNode.setAttribute('value', data.value);
    domNode.setAttribute('contenteditable', false);

    const innerText = document.createTextNode(`${data.denotationChar}${data.value}`);

    domNode.appendChild(innerText);

    return MentionBlot.setDataValues(domNode, data);
  }

  static setDataValues(element, data) {
    const domNode = element;

    Object.keys(data).forEach((key) => {
      domNode.dataset[key] = data[key];
    });

    return domNode;
  }

  static value(domNode) {
    return domNode.dataset;
  }
}
MentionBlot.blotName = 'mention';
MentionBlot.tagName = 'mention';

export default MentionBlot;
