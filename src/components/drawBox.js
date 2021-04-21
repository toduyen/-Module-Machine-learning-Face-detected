import React, { Component } from 'react';

class DrawBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptors: null,
      detections: null,
      match: null
    };
  }

  componentDidMount() {
    this.getDescription();
  }

  componentWillReceiveProps(newProps) {
    this.getDescription(newProps);
  }

  getDescription = async (props = this.props) => {
    const { fullDesc, faceMatcher } = props;
    if (!!fullDesc) {
      await this.setState({
        descriptors: fullDesc.map(fd => fd.descriptor),
        detections: fullDesc.map(fd => fd.detection)
      });
      if (!!this.state.descriptors && !!faceMatcher) {
        let match = await this.state.descriptors.map(descriptor =>
          faceMatcher.findBestMatch(descriptor)
        );
        this.setState({ match });
      }
    }
  };
  renderBlink = () => {
    let leftEye = this.props.ketquabodiqua;
    let rightEye = this.props.ketquabodiqua2;
    if((leftEye&&rightEye) < 0.28)
    {
      return(`đã nhắm mắt`);
    }
    else
    {
      return(`không nhắm mắt`);
    }
  }
  render() {
    const { imageWidth, boxColor , ketquabodiqua , ketquabodiqua2 } = this.props;
    const { detections, match } = this.state;
    let box = null;

    if (!!detections) {
      box = detections.map((detection, i) => {
        const relativeBox = detection.relativeBox;
        const dimension = detection._imageDims;
        let _X = imageWidth * relativeBox._x;
        let _Y =(relativeBox._y * imageWidth * dimension._height) / dimension._width;
        let _W = imageWidth * relativeBox.width;
        let _H =(relativeBox.height * imageWidth * dimension._height) /dimension._width;
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: boxColor,
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`
              }}
            >
              {!!match && match[i] && match[i]._label !== 'unknown' ? (
                <p
                  style={{
                    backgroundColor: boxColor,
                    border: 'solid',
                    borderColor: boxColor,
                    width: _W,
                    marginTop: 0,
                    color: '#fff',
                    transform: `translate(-3px,${_H}px)`
                  }}
                >
                  {match[i]._label}
                </p>
              ) : null}
               {ketquabodiqua && ketquabodiqua2 ? (
                <p
                  style={{
                    width: _W,
                    marginTop: 0,
                    color: '#33CC00',
                    transform: `translate(-40px,${_H}px)`
                  }}
                >
                  <small>
                  {this.renderBlink()}
                  </small>
                </p>
              ) : null}
            </div>
            
          </div>
        );
      });
    }

    return <div>{box}</div>;
  }
}

export default DrawBox;
