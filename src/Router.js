import React
        , {
            useState
            , useEffect
        } 
from 'react';

import { 
    HashRouter
    , Route
    , Switch 
} from 'react-router-dom';

// this component imports all the other componets we'v build
import Nav from './Nav';
import Admin from './Admin';
import Main from './Main';
import Profile from './Profile';

const Router = () => {
    const [current, setCurrent] = useState('home');

    useEffect(
        () => {
            setRoute();
            window.addEventListener('hashchange', setRoute);
            return () => window.removeEventListener('hashchange', setRoute) // giving back a function to react
        }
        , []
    );

    const setRoute = () => {
        const location = window.location.href.split('/');

        const pathname = location[location.length - 1];
        console.log('pathname: ', pathname);

        // setcurrent is our usestate method
        setCurrent(pathname ? pathname : 'home');
    };

    return (
        <HashRouter>
            <Nav current={current} />
            <Switch>
                <Route exact path='/' component={Main} />
                <Route path='/admin' component={Admin} />
                <Route path='/profile' component={Profile} />
                <Route component={Main} />
            </Switch>
        </HashRouter>
    );
};

export default Router