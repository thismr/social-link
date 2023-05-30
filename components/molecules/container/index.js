export const Container = (props) => {
  return (
    <div className="flex flex-col w-full h-full">
      <img
        src="/assets/common/images/bg-socmed.jpg"
        className="fixed inset-0 z-0 h-screen w-full object-cover"
      />
      <div className="fixed inset-0 z-0 h-screen w-full bg-black/50 backdrop-blur-sm" />
      {props.children}
    </div>
  );
};
