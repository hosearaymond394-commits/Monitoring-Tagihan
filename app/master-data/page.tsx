import { MasterDataTabs } from "@/components/master/MasterDataTabs";

export default function MasterDataPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="mb-0.5 text-[22px] font-bold">Master Data</h1>
        <p className="text-[13px] text-brandgrey-600">Data referensi yang digunakan pada sistem monitoring</p>
      </div>
      <MasterDataTabs />
    </div>
  );
}
