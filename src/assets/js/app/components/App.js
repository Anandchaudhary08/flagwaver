import Modernizr from 'modernizr';
import React, { Component, Fragment } from 'react';
import { MdClose, MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

import { fromHash } from '../globals/HashStore';
import initApp from '../globals/initApp';
import AnimationControlBar from '../components/AnimationControlBar';
import AppCanvas from '../components/AppCanvas';
import AppModules from '../components/AppModules';
import Drawer from '../components/Drawer';
import Icon from '../components/Icon';
import Panel from '../components/Panel';
import FlagGroupBarContainer from '../containers/FlagGroupBarContainer';
import FlagGroupPanelContainer from '../containers/FlagGroupPanelContainer';
import ToastsContainer from '../containers/ToastsContainer';
import WindBarContainer from '../containers/WindBarContainer';
import WindPanelContainer from '../containers/WindPanelContainer';
import AppContext from '../contexts/AppContext';
import withWebGLBrowserTest from '../hocs/withWebGLBrowserTest';
import store from '../redux/store';

const SITE_HEADLINE_INVERSE_IMAGE_PATH = `${process.env.PUBLIC_URL}/${
    Modernizr.svgasimg
        ? 'assets/img/site-headline-inverse.svg'
        : 'assets/img/site-headline-inverse.png'
}`;

const AppMode = {
    EDIT: 'edit',
    ANIMATE: 'animate'
};

const navItems = [
    {
        key: AppMode.EDIT,
        displayName: 'Flag'
    },
    {
        key: AppMode.ANIMATE,
        displayName: 'Animation Control'
    }
];

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDrawerOpen: false,
            isNavOpen: false,
            appMode: AppMode.EDIT
        };

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);
        this.openNav = this.openNav.bind(this);
        this.closeNav = this.closeNav.bind(this);

        this.app = null;
    }

    componentDidMount() {
        this.app = initApp();
        this.handleHashChange();
        window.addEventListener('hashchange', this.handleHashChange);
        this.forceUpdate();
    }

    componentWillUnmount() {
        this.app.destroy();
        window.removeEventListener('hashchange', this.handleHashChange);
    }

    openDrawer() {
        this.setState({ isDrawerOpen: true });
    }

    closeDrawer() {
        this.setState({ isDrawerOpen: false });
    }

    toggleDrawer() {
        if (this.state.isDrawerOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    handleHashChange() {
        fromHash(store);
    }

    openNav() {
        this.setState({
            isNavOpen: true
        });
    }

    closeNav() {
        this.setState({
            isNavOpen: false
        });
    }

    setAppMode(appMode) {
        this.setState({
            appMode: appMode,
            isNavOpen: false
        });
    }

    render() {
        const {
            isDrawerOpen,
            isNavOpen,
            appMode
        } = this.state;

        return (
            <AppContext.Provider value={this.app}>
                <AppModules />

                <header className="site-header" role="banner">
                    <div className="site-header-layout">
                        <div className="site-header-center">
                            <h1 className="site-headline">
                                <img
                                    width="189"
                                    height="48"
                                    alt="FlagWaver"
                                    src={SITE_HEADLINE_INVERSE_IMAGE_PATH}
                                />
                            </h1>
                        </div>

                        <div className="site-header-left">
                            <Drawer.Button
                                className="site-header-btn drawer-btn"
                                target="drawer"
                                open={isDrawerOpen}
                                onClick={this.toggleDrawer}
                            >
                                <span className="icon icon-bars" aria-hidden="true">
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </span>

                                <span className="sr-only">Menu</span>
                            </Drawer.Button>
                        </div>

                        <div className="site-header-right">
                            <button type="button" className="site-header-btn">
                                <span className="icon icon-dots" aria-hidden="true">
                                    <span className="icon-dot"></span>
                                    <span className="icon-dot"></span>
                                    <span className="icon-dot"></span>
                                </span>

                                <span className="sr-only">Options</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="site-main" role="main">
                    <div className="app-viewer">
                        <div className="app-bg bg-sky"></div>

                        <AppCanvas />
                    </div>

                    <Drawer.Overlay
                        open={isDrawerOpen}
                        onClick={this.closeDrawer}
                    />

                    <Drawer id="drawer" open={isDrawerOpen}>
                        <div className="panel-navbar">
                            <div className="panel-navbar-layout">
                                <div className="panel-navbar-left">
                                    {isNavOpen ? (
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            onClick={this.closeNav}
                                        >
                                            <Icon component={MdArrowDropUp} />
                                            <span className="btn-text" aria-hidden="true">Panels</span>
                                            <span className="sr-only">Close panels menu</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            onClick={this.openNav}
                                        >
                                            <Icon component={MdArrowDropDown} />
                                            <span className="btn-text" aria-hidden="true">Panels</span>
                                            <span className="sr-only">Open panels menu</span>
                                        </button>
                                    )}
                                </div>

                                <div className="panel-navbar-right">
                                    <Drawer.Button
                                        className="btn btn-link"
                                        target="drawer"
                                        open={isDrawerOpen}
                                        onClick={this.closeDrawer}
                                    >
                                        <Icon component={MdClose} />
                                        <span className="sr-only">Close menu</span>
                                    </Drawer.Button>
                                </div>
                            </div>
                        </div>

                        {isNavOpen ? (
                            <div className="panel">
                                <div className="panel-nav">
                                    <h2 className="sr-only">Panel menu</h2>

                                    <ul className="nav">
                                        {navItems.map(({ key, displayName }) => (
                                            <li
                                                key={key}
                                                className={'nav-item' + (appMode === key ? ' ' + 'active' : '')}
                                            >
                                                <button
                                                    type="button"
                                                    className="link"
                                                    onClick={() => { this.setAppMode(key); }}
                                                >
                                                    {displayName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (appMode === AppMode.EDIT) ? (
                            <Panel title="Edit Flag">
                                <FlagGroupPanelContainer />

                                <hr />

                                <WindPanelContainer />
                            </Panel>
                        ) : (appMode === AppMode.ANIMATE) ? (
                            <Panel title="Animation Control">
                                <AnimationControlBar />
                            </Panel>
                        ) : null}
                    </Drawer>

                    <div className="bottom-app-bar">
                        {(appMode === AppMode.EDIT) ? (
                            <Fragment>
                                <div className="bottom-app-bar-primary">
                                    <FlagGroupBarContainer />
                                </div>

                                <div className="bottom-app-bar-secondary">
                                    <WindBarContainer />
                                </div>

                                <div className="bottom-app-bar-tertiary">
                                    <div className="form-section">
                                        <button
                                            type="button"
                                            className="btn btn-link"
                                            onClick={this.openDrawer}
                                        >
                                            All options
                                        </button>
                                    </div>
                                </div>
                            </Fragment>
                        ) : (appMode === AppMode.ANIMATE) ? (
                            <div className="bottom-app-bar-primary">
                                <AnimationControlBar />
                            </div>
                        ) : null}
                    </div>
                </main>

                <ToastsContainer />
            </AppContext.Provider>
        );
    }
}

export default withWebGLBrowserTest(App);
