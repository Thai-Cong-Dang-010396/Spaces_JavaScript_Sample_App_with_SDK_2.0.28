import { connect } from 'react-redux';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import {
  setCurrentLayout,
  toggleLayoutModal,
  setCurrentBackgroundTheme
} from '../redux/actions/spaceActions';
import { VIDEO_BACKGROUND_THEME, VIDEO_LAYOUT_TYPES } from '../redux/actions/types';
import AUDITORIUM_VIDEO_THEME from '../assets/img/auditorium-video-theme.png';
import AVAYA_VIDEO_THEME from '../assets/img/avaya-video-theme.png';
import CLASSROOM_VIDEO_THEME from '../assets/img/classroom-video-theme.png';
import COFFEESHOP_VIDEO_THEME from '../assets/img/coffeeshop-video-theme.png';
import OFFICE_VIDEO_THEME from '../assets/img/office-video-theme.png';

const mapStateToProps = (state) => ({
  currentLayout: state.data.currentLayout,
  showLayoutModal: state.data.showLayoutModal,
  currentTheme: state.data.currentTheme
});

function LayoutOptions(props) {
  const { currentLayout, showLayoutModal, currentTheme } = props;
  const SHOW_MODAL_TIMEOUT = 1000;

  const setLayoutToAutomatic = () => {
    if (currentLayout === VIDEO_LAYOUT_TYPES.AUTOMATIC) {
      return;
    }
    props.setCurrentLayout(VIDEO_LAYOUT_TYPES.AUTOMATIC);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };

  const setLayoutToGrid = () => {
    if (currentLayout === VIDEO_LAYOUT_TYPES.GRID) {
      return;
    }
    props.setCurrentLayout(VIDEO_LAYOUT_TYPES.GRID);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };

  const setLayoutToLecture = () => {
    if (currentLayout === VIDEO_LAYOUT_TYPES.ACTIVE_SPEAKER) {
      return;
    }
    props.setCurrentLayout(VIDEO_LAYOUT_TYPES.ACTIVE_SPEAKER);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };

  const setLayoutToLecturePanel = () => {
    if (currentLayout === VIDEO_LAYOUT_TYPES.THUMBNAIL_HORIZONTAL) {
      return;
    }
    props.setCurrentLayout(VIDEO_LAYOUT_TYPES.THUMBNAIL_HORIZONTAL);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };

  const setLayoutToConcert = () => {
    if (currentLayout === VIDEO_LAYOUT_TYPES.CONCERT) {
      return;
    }
    props.setCurrentLayout(VIDEO_LAYOUT_TYPES.CONCERT);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };
  const setLayoutToThemes = () => {
    if (currentLayout === VIDEO_LAYOUT_TYPES.THEME) {
      return;
    }
    props.setCurrentLayout(VIDEO_LAYOUT_TYPES.THEME);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT + 2000);
  };
  const setBackgroundToCoffeeShop = () => {
    if (currentTheme === VIDEO_BACKGROUND_THEME.COFFEE_SHOP) {
      return;
    }
    props.setCurrentBackgroundTheme(VIDEO_BACKGROUND_THEME.COFFEE_SHOP);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };
  const setBackgroundToAvaya = () => {
    if (currentTheme === VIDEO_BACKGROUND_THEME.AVAYA) {
      return;
    }
    props.setCurrentBackgroundTheme(VIDEO_BACKGROUND_THEME.AVAYA);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };
  const setBackgroundToOffice = () => {
    if (currentTheme === VIDEO_BACKGROUND_THEME.OFFICE) {
      return;
    }
    props.setCurrentBackgroundTheme(VIDEO_BACKGROUND_THEME.OFFICE);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };
  const setBackgroundToClassRoom = () => {
    if (currentTheme === VIDEO_BACKGROUND_THEME.CLASSROOM) {
      return;
    }
    props.setCurrentBackgroundTheme(VIDEO_BACKGROUND_THEME.CLASSROOM);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };
  const setBackgroundToAuditorium = () => {
    if (currentTheme === VIDEO_BACKGROUND_THEME.AUDITORIUM) {
      return;
    }
    props.setCurrentBackgroundTheme(VIDEO_BACKGROUND_THEME.AUDITORIUM);
    setTimeout(() => {
      props.toggleLayoutModal(!showLayoutModal);
    }, SHOW_MODAL_TIMEOUT);
  };

  return (
    <Form>
      <Form.Check
        type="radio"
        name="layout"
        id={VIDEO_LAYOUT_TYPES.AUTOMATIC}
        label="Automatic"
        onClick={() => {
          setLayoutToAutomatic();
        }}
        checked={currentLayout === VIDEO_LAYOUT_TYPES.AUTOMATIC}
      />
      <Form.Check
        type="radio"
        name="layout"
        id={VIDEO_LAYOUT_TYPES.GRID}
        label="Grid"
        onClick={() => {
          setLayoutToGrid();
        }}
        checked={currentLayout === VIDEO_LAYOUT_TYPES.GRID}
      />
      <Form.Check
        type="radio"
        name="layout"
        id={VIDEO_LAYOUT_TYPES.ACTIVE_SPEAKER}
        label="Lecture"
        onClick={() => {
          setLayoutToLecture();
        }}
        checked={currentLayout === VIDEO_LAYOUT_TYPES.ACTIVE_SPEAKER}
      />
      <Form.Check
        type="radio"
        name="layout"
        id={VIDEO_LAYOUT_TYPES.THUMBNAIL_HORIZONTAL}
        label="Lecture panel"
        onClick={() => {
          setLayoutToLecturePanel();
        }}
        checked={currentLayout === VIDEO_LAYOUT_TYPES.THUMBNAIL_HORIZONTAL}
      />
      <Form.Check
        type="radio"
        name="layout"
        id={VIDEO_LAYOUT_TYPES.CONCERT}
        label="Concert"
        onClick={() => {
          setLayoutToConcert();
        }}
        checked={currentLayout === VIDEO_LAYOUT_TYPES.CONCERT}
      />
      <Form.Check
        type="radio"
        name="layout"
        id={VIDEO_LAYOUT_TYPES.THEME}
        label="Immersive Room"
        onClick={() => {
          setLayoutToThemes();
        }}
        checked={currentLayout === VIDEO_LAYOUT_TYPES.THEME}
      />
      {currentLayout === VIDEO_LAYOUT_TYPES.THEME ? (
        <div>
          <Image
            onClick={() => {
              setBackgroundToCoffeeShop();
            }}
            style={
              currentTheme === VIDEO_BACKGROUND_THEME.COFFEE_SHOP
                ? { border: '2px solid blue' }
                : {}
            }
            fluid
            thumbnail
            onHover={{ style: { border: '1px solid blue' } }}
            src={COFFEESHOP_VIDEO_THEME}
          />
          <Image
            onClick={() => {
              setBackgroundToAvaya();
            }}
            style={
              currentTheme === VIDEO_BACKGROUND_THEME.AVAYA ? { border: '2px solid blue' } : {}
            }
            fluid
            thumbnail
            src={AVAYA_VIDEO_THEME}
          />
          <Image
            onClick={() => {
              setBackgroundToOffice();
            }}
            style={
              currentTheme === VIDEO_BACKGROUND_THEME.OFFICE ? { border: '2px solid blue' } : {}
            }
            fluid
            thumbnail
            src={OFFICE_VIDEO_THEME}
          />
          <Image
            onClick={() => {
              setBackgroundToClassRoom();
            }}
            style={
              currentTheme === VIDEO_BACKGROUND_THEME.CLASSROOM ? { border: '2px solid blue' } : {}
            }
            fluid
            thumbnail
            src={CLASSROOM_VIDEO_THEME}
          />
          <Image
            onClick={() => {
              setBackgroundToAuditorium();
            }}
            style={
              currentTheme === VIDEO_BACKGROUND_THEME.AUDITORIUM ? { border: '2px solid blue' } : {}
            }
            fluid
            thumbnail
            src={AUDITORIUM_VIDEO_THEME}
          />
        </div>
      ) : (
        ''
      )}
    </Form>
  );
}

export default connect(mapStateToProps, {
  toggleLayoutModal,
  setCurrentLayout,
  setCurrentBackgroundTheme
})(LayoutOptions);
