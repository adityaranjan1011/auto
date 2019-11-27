import React from "react";
import ClickOutside from "@src/ui-components/ClickOutside";
import "./autosuggestion.css";

const ARROW_UP = "ArrowUp";
const ARROW_DOWN = "ArrowDown";
const TAB = "Tab";

class Autosuggestion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoveredItem: -1,
      open: false
    };
  }

  openSuggestions = () => {
    if (!this.state.open) {
      this.setState({ open: true });
    }
  };

  closeSuggestions = () => {
    if (this.state.open) {
      this.setState({ open: false });
    }
  };

  onQueryChange = ({ target: { value, id, name } }) => {
    if (this.state.hoveredItem !== -1) {
      this.setState({ hoveredItem: -1 });
    }
    this.openSuggestions();
    this.props.inputProps.onChange({ value, name });
  };

  selectItem = (value, id) => {
    this.closeSuggestions();
    this.props.onSelection(value, id);
  };

  handleArrowKeys = (e, prevState) => {
    const itemsLength = (this.props.suggestions || []).length;

    if (![ARROW_DOWN, ARROW_UP].includes(e.key) || !prevState.open) {
      return null;
    }

    let { hoveredItem } = prevState;

    if (e.key === ARROW_UP) {
      if (itemsLength && hoveredItem > 0) {
        hoveredItem -= 1;
      }
    } else if (e.key === ARROW_DOWN) {
      if (itemsLength && hoveredItem < itemsLength - 1) {
        hoveredItem += 1;
      }
    }

    // dont do anything if same item is hovered again
    if (prevState.hoveredItem === hoveredItem) return null;

    const { name = "" } = this.props.suggestions[hoveredItem];
    this.props.onSelection(name);

    return {
      hoveredItem
    };
  };

  handleKeyDown = e => {
    e.persist();
    // if pressed tab, close the suggestions
    if (e.key === TAB) {
      this.closeSuggestions();
      return;
    }

    this.setState(prevState => {
      const itemsLength = (this.props.suggestions || []).length;
      if (!itemsLength) {
        return {
          hoveredItem: -1
        };
      }

      return { ...this.handleArrowKeys(e, prevState) };
    });
  };

  renderItems = ({ items, selectItem, hoveredItem }) => (
    <div className="autoInputBox">
      <ul className="autoInputBox-ul">
        {items.map((item, index) => (
          <li
            key={`${item.name}-${item.id}`}
            className={`autoInputBox-li ${
              index === hoveredItem ? "hovered-item" : ""
            }`}
            onClick={() => selectItem(item.name, item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );

  render() {
    const RenderItems = this.props.renderItems || this.renderItems;
    const { hoveredItem } = this.state;
    const {
      suggestions,
      inputProps: { onChange, ...restInputProps }
    } = this.props;
    return (
      <ClickOutside handleClickOutside={this.closeSuggestions}>
        <div className="autosuggest">
          <input
            type="text"
            tabIndex="0"
            className="autosuggest-input"
            // className="Registration__Input"
            {...restInputProps}
            onChange={this.onQueryChange}
            onKeyDown={this.handleKeyDown}
            onFocus={this.openSuggestions}
          />
          {this.state.open &&
            (restInputProps.value || "").length > 0 &&
            (suggestions || []).length > 0 && (
              <RenderItems
                items={suggestions}
                selectItem={this.selectItem}
                hoveredItem={hoveredItem}
              />
            )}
        </div>
      </ClickOutside>
    );
  }
}

export default Autosuggestion;
