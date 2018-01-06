import React from 'react';
import Link from 'gatsby-link';

export default
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forceOpen: false,
    };
  }

  toggleForceOpen() { this.setState({ forceOpen: !this.state.forceOpen }) }

  render() {
    const style = {};

    if (this.state.forceOpen) {
      style.display = 'block';
    }
    return (
      <div>
        <div className="Hr__SidebarToggle" onClick={() => this.toggleForceOpen()}>☰</div>
        <div className="HR__SidebarContent" style={style} onClick={() => this.toggleForceOpen()}>
          <h3>Docs</h3>
          {this.props.items.map((x) => {
            return (
              <div className="HR__SidebarItem">
                <Link to={x.fields.slug}>
                  {x.frontmatter.title}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
