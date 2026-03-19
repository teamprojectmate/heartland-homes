import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { store } from './store/store';
import './styles/main.scss';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
					<App />
				</GoogleOAuthProvider>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
);
