import { GroupCard } from "../component/chat/group-card";
import { PrivateCard } from "../component/chat/private-card";
import SearchInput from "../component/chat/Search-input"; // Remove curly braces for default import

const Chat = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Inbox</h1>
          <span className="px-6 py-1 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm">
            2 new
          </span>
        </div>
        <div className="w-full">
          <SearchInput />
        </div>
        <GroupCard />
        <PrivateCard />
      </div>
    </div>
  );
};

export default Chat;