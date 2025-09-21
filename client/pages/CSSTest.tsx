export default function CSSTest() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">CSS Test Page</h1>

      <div>
        <h2 className="text-lg font-semibold mb-4">Testing Custom Utility Classes</h2>

        <div className="space-y-4">
          {/* Test ui-card */}
          <div>
            <p className="text-sm text-gray-600 mb-2">ui-card class:</p>
            <div className="ui-card p-4">
              This should be a card with rounded corners, gray border, and white background
            </div>
          </div>

          {/* Test ui-chip */}
          <div>
            <p className="text-sm text-gray-600 mb-2">ui-chip class:</p>
            <button className="ui-chip">
              This should be a chip/pill button
            </button>
          </div>

          {/* Test ui-focus */}
          <div>
            <p className="text-sm text-gray-600 mb-2">ui-focus class (tab to see focus ring):</p>
            <button className="ui-focus px-4 py-2 bg-blue-500 text-white rounded">
              Focus me with tab key
            </button>
          </div>

          {/* Test body styles */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Body background and text (inherited from body):</p>
            <div className="p-4 border">
              Text should be using the foreground color and Wix Madefor Text font
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-100 rounded">
        <p className="text-green-800">✓ If you can see styled elements above, CSS is working correctly!</p>
      </div>
    </div>
  );
}