// src/App.jsx

import Editor from './components/Editor'  // we'll create this next

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Our GrapesJS editor will fill the full screen */}
      <Editor />
    </div>
  );
}

export default App;