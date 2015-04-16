var React = require('react');

var Background = React.createClass({
  render: function(){
    var style = {};

    if (this.props.image !== null) {
    	style.backgroundImage = 'url(' + this.props.image + ')';
    } else {
    	style.backgroundImage = 'url(images/bg.jpg)';
    }

    return (
      <div className="background" style={style}></div>
    );
  }
});

module.exports = Background;
