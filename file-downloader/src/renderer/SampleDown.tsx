const SMAPLE_URL =
  'https://jinhakstorageaccount.blob.core.windows.net/catchcam/22032806_45415_152942.mp4?sv=2021-08-06&st=2022-12-29T04%3A30%3A24Z&se=2022-12-30T04%3A30%3A24Z&sr=b&sp=r&sig=GitqeOy7UMfxqG1h9R0dS9fAGk2dTjDtCqfkSsEY54o%3D';

const SampleDown = () => {
  return (
    <div>
      <div className="SampleDown">
        <button
          type="button"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('download', {
              url: SMAPLE_URL,
            });
          }}
        >
          <span role="img" aria-label="books">
            📚
          </span>
          다운로드
        </button>
      </div>
    </div>
  );
};

export default SampleDown;
