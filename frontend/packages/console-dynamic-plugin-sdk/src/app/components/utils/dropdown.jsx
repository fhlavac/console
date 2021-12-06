import * as React from 'react';
import { CaretDownIcon } from '@patternfly/react-icons';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { impersonateStateToProps } from '../../reducers/ui'; // migrate this file to .tsx
import { useSafetyFirst } from '../safety-first'; // migrate this file to .tsx
import { KebabItems } from './kebab'; // migrate this file to .tsx
import { checkAccess } from './rbac'; // migrate this file to .tsx
import { history } from './router'; // do we want to migrate it?

export class DropdownMixin extends React.PureComponent {
  constructor(props) {
    super(props);
    // eslint-disable-next-line no-underscore-dangle
    this.listener = this._onWindowClick.bind(this);
    // eslint-disable-next-line react/no-unused-state
    this.state = { active: !!props.active, selectedKey: props.selectedKey };
    this.toggle = this.toggle.bind(this);
    this.dropdownElement = React.createRef();
    this.dropdownList = React.createRef();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps({ selectedKey, items }) {
    if (selectedKey !== this.props.selectedKey) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ selectedKey, title: items[selectedKey] });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.listener);
  }

  // eslint-disable-next-line no-underscore-dangle
  onClick_(selectedKey, e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const { items, actionItems, onChange, noSelection, title } = this.props;

    if (onChange) {
      onChange(selectedKey, e);
    }

    const newTitle = items[selectedKey];

    if (!actionItems || !_.some(actionItems, { actionKey: selectedKey })) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ selectedKey, title: noSelection ? title : newTitle });
    }

    this.hide();
  }

  toggle(e) {
    e.preventDefault();

    if (this.props.disabled) {
      return;
    }

    if (this.state.active) {
      this.hide(e);
    } else {
      this.show(e);
    }
  }

  show() {
    /* If you're wondering why this isn't in componentDidMount, it's because
     * kebabs are dropdowns. A list of 200 pods would mean 200 global event
     * listeners. This is bad for performance. - ggreer
     */
    window.removeEventListener('click', this.listener);
    window.addEventListener('click', this.listener);
    this.setState({ active: true });
  }

  hide(e) {
    // eslint-disable-next-line no-unused-expressions
    e && e.stopPropagation();
    window.removeEventListener('click', this.listener);
    this.setState({ active: false });
  }

  // eslint-disable-next-line no-underscore-dangle
  _onWindowClick(event) {
    if (!this.state.active) {
      return;
    }

    const { current } = this.dropdownElement;
    if (!current) {
      return;
    }

    if (event.target === current || (current && current.contains(event.target))) {
      return;
    }

    this.hide(event);
  }
}

// TODO: define exact propTypes
DropdownMixin.propTypes = PropTypes.any;

class ActionsMenuDropdown_ extends DropdownMixin {
  render() {
    const { actions, title = undefined, t } = this.props;
    const onClick = (event, option) => {
      event.preventDefault();

      if (option.callback) {
        option.callback();
      }

      if (option.href) {
        history.push(option.href);
      }

      this.hide();
    };
    return (
      <div
        ref={this.dropdownElement}
        className={classNames({
          'co-actions-menu pf-c-dropdown': true,
          'pf-m-expanded': this.state.active,
        })}
      >
        <button
          type="button"
          aria-haspopup="true"
          aria-label={t('public~Actions')}
          aria-expanded={this.state.active}
          className="pf-c-dropdown__toggle"
          onClick={this.toggle}
          data-test-id="actions-menu-button"
        >
          <span className="pf-c-dropdown__toggle-text">{title || t('public~Actions')}</span>
          <CaretDownIcon className="pf-c-dropdown__toggle-icon" />
        </button>
        {this.state.active && <KebabItems options={actions} onClick={onClick} />}
      </div>
    );
  }
}

const ActionsMenuDropdown = withTranslation()(ActionsMenuDropdown_);

const ConnectedActionsMenu = ({ actions = [], impersonate = undefined, title = undefined }) => {
  const [isVisible, setVisible] = useSafetyFirst(false);

  // Check if any actions are visible when actions have access reviews.
  React.useEffect(() => {
    if (!actions.length) {
      setVisible(false);
      return;
    }
    const promises = actions.reduce((acc, action) => {
      if (action.accessReview) {
        acc.push(checkAccess(action.accessReview));
      }
      return acc;
    }, []);

    // Only need to resolve if all actions require access review
    if (promises.length !== actions.length) {
      setVisible(true);
      return;
    }
    Promise.all(promises)
      .then((results) => setVisible(_.some(results, 'status.allowed')))
      .catch(() => setVisible(true));
  }, [actions, impersonate, setVisible]);
  return isVisible ? <ActionsMenuDropdown actions={actions} title={title} /> : null;
};

export const ActionsMenu = connect(impersonateStateToProps)(ConnectedActionsMenu);

ActionsMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      labelKey: PropTypes.string,
      href: PropTypes.string,
      callback: PropTypes.func,
      accessReview: PropTypes.object,
    }),
  ).isRequired,
  title: PropTypes.node,
};

ConnectedActionsMenu.propTypes = ActionsMenu.propTypes;
