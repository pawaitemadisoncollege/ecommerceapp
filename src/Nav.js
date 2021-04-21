import React, { 
    useState
    , useEffect 
} from 'react';

import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { 
    HomeOutlined
    , UserOutlined
    , ProfileOutlined 
} from '@ant-design/icons';

import { Hub } from 'aws-amplify';  // hub is an aws amplify class that allows us to be notfied when logged in user state changes
import checkUser from './checkUser';

const Nav = ({ current }) => {

    const [user, updateUser] = useState({});

    useEffect( // takes 2 parameters
        () => {  //lambda
            checkUser(updateUser);
            Hub.listen(
                'auth' 
                , (data) => {
                    const { payload: { event } } = data;
                    console.log('event: ', event);

                    if (event === 'signIn' || event === 'signOut') {
                        checkUser(updateUser);
                    }       
                }
            );
        }
        , []
    );

    return (
        <div>
            <Menu 
                selectedKeys={[current]} 
                mode="horizontal"
            >
                <Menu.Item key='home'>
                    <Link to={`/`}>
                        <HomeOutlined />
                        Home
                    </Link>
                </Menu.Item>
                <Menu.Item key='profile'>
                    <Link to='/profile'>
                        <UserOutlined />
                        Profile
                    </Link>
                </Menu.Item>
                {  //jsx expression
                    user.isAuthorized && ( // if authorized, do this... boolean short-circuit
                        <Menu.Item key='admin'>
                            <Link to='/admin'>
                                <ProfileOutlined />
                                Admin
                            </Link>
                        </Menu.Item>
                    )
                }
            </Menu>
        </div>
    );
};

export default Nav;