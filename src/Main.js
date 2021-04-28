import
React
, {
  useState
  , useEffect
} from 'react';

import Container from './Container';
import { API } from 'aws-amplify';
import { List } from 'antd';
import checkUser from './checkUser';

const Main = () => {

    const [state, setState] = useState(
        {
            products: []
            , loading: true
        }
    );

    const [user, updateUser] = useState({});

    let didCancel = false;

    useEffect(
        () => {
            getProducts();
            checkUser(updateUser);
            return () => didCancel = true;      
        }
        , [] // could put other properties in here such that when they change this would run again.
    );
    
    const getProducts = async () => {
        const data = await API.get('ecommerceapi', '/products');
        console.log('data: ', data)

        if (didCancel) { // sentinal - do a check and bail if necessary
            return;
        }

        setState(
            {
                products: data.data.Items
                , loading: false
            }
        );
    };

    const deleteItem = async (id) => {
        try {
            const products = state.products.filter(p => p.id !== id);  // keep everything that isnt' equal to the passed in id
            
            setState(  //optimistic delete - takes the product out before it actually deletes.
                { ...state
                    , products // shortcut from products: products
                }
            );

            await API.del(
                'ecommerceapi'
                , '/products'
                , { 
                    body: { 
                        id // short for id: id
                    } 
                }
            );

            console.log('successfully deleted item');

        } catch (err) {
            console.error('error: ', err);
            // consider refreshing the list if the delete failed so the ui matches the actual
        }
    };

    return (
        <Container>
            <List
                itemLayout="horizontal"
                dataSource={state.products}
                loading={state.loading}
                renderItem={item => (
                    <List.Item
                        actions={
                            user.isAuthorized 
                            ? [             // if auth
                                <p 
                                    onClick={() => deleteItem(item.id)}
                                    key={item.id}>
                                        delete
                                </p>
                            ] 
                            : null // not auth
                        }
                    >
            
                        <List.Item.Meta
                            title={item.name}
                            description={item.price}
                        />
                    </List.Item>
                )}
            />
        </Container>
    );
}

export default Main;