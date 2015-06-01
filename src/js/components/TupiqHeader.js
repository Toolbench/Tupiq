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
    var logoContainerClassName = classNames({
    	'tupiq__header__logo-container': true,
    	'loading': this.props.isBackgroundLoading,
    	'errored': this.props.hasBackgroundErrored
    });

    var shuffleProgressIndicatorStyle = !this.props.isBackgroundLoading ? { display: 'none' } : {
      width: this.props.backgroundShuffleProgress + '%'
    };

    return (
      <div className="tupiq__header" onMouseDown={this.props.onMouseDown}>
        <div className={logoContainerClassName} onClick={this.props.onClick}>
	        <img src="images/tupiq-logo.svg" className="tupiq__header__logo-container__tupiq-logo" />
	      </div>

	      <span className="shuffle-progress-indicator" style={shuffleProgressIndicatorStyle}></span>
      </div>
    )
  }
});

module.exports = TupiqHeader;
