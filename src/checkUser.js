import { Auth } from 'aws-amplify';

const checkUser = async (updateUser) => {  

    try {
        const userData = await Auth.currentSession();

        // nice to see what's going on
        console.log("checkUser", userData);

        // nested object destructuring
        // userData is an object that has an idToken which is an object that has a payload object
        const { idToken: { payload }} = userData;
        
        // initialize a boolean whether or not the user is in the admin group
        // payload.cognito:group, but can use a square bracket indexer as show below
        const isAuthorized = payload['cognito:groups'] &&  payload['cognito:groups'].includes('Admin');
        updateUser(
            {
                username: payload['cognito:username']
                , isAuthorized // js property shorthand for isAuthorized: isAuthorized
            }
        );
        
    }

    catch (err) {
        console.error(err);
        updateUser({});
    }
}

export default checkUser