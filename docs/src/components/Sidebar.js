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

    const otherCategory = { label: 'Other', category: 'other', items: [] };

    const byCategory = [
      { label: 'Overview', category: 'overview', items: [] },
      { label: 'makeHr', category: 'makeHr', items: [] },
      { label: 'withProps', category: 'withProps', items: [] },
      { label: 'API', category: 'api', items: [] },
      otherCategory,
    ];

    this.props.items.forEach((x) => {
      const { fields: { slug }, frontmatter: { category, title, shortTitle } } = x;

      const categoryItems = byCategory.find(x => x.category === category) || otherCategory;
      categoryItems.items.push({ slug, category, title, shortTitle });
    });

    return (
      <div>
        <div className="Hr__SidebarToggle" onClick={() => this.toggleForceOpen()}>☰</div>
        <div className="HR__SidebarContent" style={style} onClick={() => this.toggleForceOpen()}>
          {byCategory.map((cat) => {
            if (!cat.items.length) return null;
            return (
              <div>
                {cat.label && <h3>{cat.label}</h3>}
                {cat.items.map(item => (
                  <div className="HR__SidebarItem">
                    <Link to={item.slug}>
                      {item.shortTitle || item.title}
                    </Link>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
