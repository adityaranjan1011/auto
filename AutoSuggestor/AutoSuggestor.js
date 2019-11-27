import React, { Component, Fragment } from "react";
import { debounce } from "lodash";
import AutoSuggest from "@src/common/AutoSuggest";
import davidService from "@src/constants/davidServices";
import "./AutoSuggestor.scss";

class AutoSuggestor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      value: ""
    };
  }

  getApiData = debounce(({ value, id }) => {
    const suggestionUrl = this.props.suggestionUrl.replace("{value}", value);
    davidService.get(suggestionUrl).then(res => {
      this.setState({ suggestions: res.data.data });
    });
  }, 200);

  onInputChange = ({ value, ...rest }) => {
    this.setState({ value });
    this.getApiData({ value, ...rest });
  };

  onSelection = (value, id) => {
    this.setState({ value });
    this.props.handleChangeCompanyName(value, id);
  };

  clearSuggestions = () => {
    this.setState({ suggestions: [] });
  };

  render() {
    const { suggestions, value } = this.state;
    const { id } = this.props;

    const inputProps = {
      value,
      type: "text",
      onChange: this.onInputChange
    };
    return (
      <>
        <label className="Registration__label" htmlFor="Company Name">
          Company Name <span className="colorThunderbird">*</span>
        </label>
        <AutoSuggest
          id={id}
          suggestions={suggestions}
          clearSuggestions={this.clearSuggestions}
          onSelection={this.onSelection}
          inputProps={inputProps}
        />
      </>
    );
  }
}

export default AutoSuggestor;
