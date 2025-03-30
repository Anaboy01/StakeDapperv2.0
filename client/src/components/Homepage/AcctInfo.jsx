import { Coins, Clock } from "lucide-react"

export default function AccountInfo({ mpxBalance, xfiBalance, totalStaked, totalRewards }) {
  return (
    <div className="w-full lg:w-[30%] lg:max-w-[307.2px] md:w-auto">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-xs text-blue-600">MPX</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="font-medium">
                  {Number.parseFloat(mpxBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-xs text-blue-600">XFI</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="font-medium">
                  {Number.parseFloat(xfiBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Rewards</p>
                <p className="font-medium">
                  {totalRewards} XFI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

