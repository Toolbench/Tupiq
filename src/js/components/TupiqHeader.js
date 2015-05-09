/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * TupiqHeader
 */
var TupiqHeader = React.createClass({
  render: function(){
    var logoClassName = classNames({
    	'tupiq__header__tupiq-logo': true,
    	'loading': this.props.isBackgroundLoading
    });

    return (
      <div className="tupiq__header" onMouseDown={this.props.onMouseDown}>
        <img src="images/tupiq-v3.svg" className={logoClassName} onClick={this.props.onClick} />
      </div>
    )
  }
});

module.exports = TupiqHeader;
