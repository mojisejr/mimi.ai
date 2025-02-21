import { useLine } from "@/providers/line";

export default function MiniNavMenu() {
  const { logout } = useLine();
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-square m-1">
        เมนู
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <a>เติมเครดิด</a>
        </li>
        <li>
          <a>คู่มือการใช้งาน</a>
        </li>
        <li>
          <button onClick={logout}>ออกจากระบบ</button>
        </li>
      </ul>
    </div>
  );
}
