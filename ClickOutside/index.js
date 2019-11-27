import React from "react";
import PropTypes from "prop-types";

class ClickOutside extends React.PureComponent {
  constructor(props) {
    super(props);
    this.domNode = null;
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  }

  handleClickOutside = e => {
    if (this.domNode && !this.domNode.contains(e.target)) {
      this.props.handleClickOutside(e);
    }
  };

  render() {
    return (
      <div
        ref={c => {
          this.domNode = c;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

ClickOutside.propTypes = {
  handleClickOutside: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired
};

export default ClickOutside;
