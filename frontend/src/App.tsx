import { useContext } from 'react';
import SignupForm from './components/SignupForm';
import { UserContext } from './context/auth';

function App() {
    const { isLoggedIn } = useContext(UserContext)!;

    return <>{isLoggedIn ? null : <SignupForm />}</>;
}

export default App;
