const mentionItemList = (item, no_matches_found) => {
  const htmlItem = item.id
    ? `
      <div class="mentionSuggestions">
        <div class="mentionSuggestionsEntryContainer">
          <div class="mentionSuggestionsEntryContainerLeft">
            <img
              src=${item.avatar}
              class="space-member__avatar"
              role="presentation"
            />
          </div>
          <div class="mentionSuggestionsEntryContainerRight">
            <div class="mentionSuggestionsEntryText">${item.value}</div>
            <div class="mentionSuggestionsEntryTitle">${item.username}</div>
          </div>
        </div>
      </div>
    `
    : `
      <div class="mentionSuggestions">
        <div class="mentionSuggestionsEntryContainer">
          <div class="mentionSuggestionsEntryContainerRight">
            <div class="mentionSuggestionsEntryTitle nomatches">
              ${no_matches_found}
            </div>
          </div>
        </div>
      </div>`;

  return htmlItem;
};

export default mentionItemList;
