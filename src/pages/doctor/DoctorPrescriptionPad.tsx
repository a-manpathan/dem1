import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

const DoctorPrescriptionPad = () => {
  const [headerFile, setHeaderFile] = useState(null);
  const [footerFile, setFooterFile] = useState(null);
  const [configOptions, setConfigOptions] = useState({
    patientName: true,
    age: true,
    contactNum: true,
    uhid: true,
    abhaNum: true,
    chiefComplaints: true,
    referredBy: false,
    maritalStatus: false,
    bloodGroup: false,
    vitals: false,
    diagnosis: false,
    medication: false
  });

  const handleToggleOption = (option) => {
    setConfigOptions({
      ...configOptions,
      [option]: !configOptions[option]
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Configure Prescription Pad</h1>
      <p className="text-gray-500 mb-8">Create/ Update template for Prescription pad</p>
      
      <div className="flex gap-8">
        <div className="w-1/2">
          {/* Upload Header */}
          <div className="mb-6">
            <p className="mb-2">Upload header</p>
            <div className="border rounded-md p-3 flex justify-between items-center bg-white">
              <div className="flex items-center">
                <div className="text-blue-500 mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Header</span>
              </div>
              <button className="text-gray-500">
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Upload Footer */}
          <div className="mb-6">
            <p className="mb-2">Upload Footer</p>
            <div className="border rounded-md p-3 flex justify-between items-center bg-white">
              <div className="flex items-center">
                <div className="text-blue-500 mr-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Upload Pdf</span>
              </div>
              <button className="text-gray-500">
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Configure Items */}
          <div className="mb-6">
            <p className="mb-4">Configure the items you can see in prescription pad.</p>
            
            {/* Configuration options */}
            <div className="space-y-4">
              {Object.entries(configOptions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 8L10 16L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                  <Switch checked={value} onCheckedChange={() => handleToggleOption(key)} />
                </div>
              ))}
            </div>
          </div>
          
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Preview Pad</Button>
        </div>
        
        {/* Preview Section */}
        <div className="w-1/2">
          <h3 className="mb-4">Preview</h3>
          <div className="border rounded-md p-4 bg-white h-[500px] overflow-auto">
            {/* Prescription preview */}
            <div className="text-left">
              {/* Doctor and Clinic Header */}
              <div className="flex justify-between mb-4 border-b pb-2">
                <div>
                  <h3 className="font-bold text-blue-600">Dr. Onkar Bhave</h3>
                  <p className="text-sm">M.B.B.S, M.D, M.S | Reg No: 270988 |</p>
                  <p className="text-sm">Mob. No: 8983390126</p>
                </div>
                <div className="flex items-start">
                  <div className="mr-2">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6IiBmaWxsPSIjMDA4MDAwIi8+PHBhdGggZD0iTTEyIDZjLTMuMzEgMC02IDIuNjktNiA2czIuNjkgNiA2IDYgNi0yLjY5IDYtNi0yLjY5LTYtNi02em0wIDEwYy0yLjIxIDAtNC0xLjc5LTQtNHMxLjc5LTQgNC00IDQgMS43OSA0IDQtMS43OSA0LTQgNHoiIGZpbGw9IiMwMDgwMDAiLz48L3N2Zz4=" alt="Clinic Logo" className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-600">Care Clinic</h3>
                    <p className="text-sm">Near Axis Bank, Kothrud, Pune - 411038</p>
                    <p className="text-sm">Ph: 094233 80390, Timing: 09:00 AM - 02:00 PM | Closed: Thursday</p>
                  </div>
                </div>
              </div>
              
              {/* Barcode and Patient Info */}
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="mb-2">
                      <svg className="w-32 h-10" viewBox="0 0 100 30">
                        {/* Simple barcode representation */}
                        {Array.from({ length: 30 }).map((_, i) => (
                          <rect key={i} x={i * 3} y="0" width="2" height="30" fill={Math.random() > 0.5 ? "black" : "white"} />
                        ))}
                      </svg>
                    </div>
                    <p className="text-sm"><strong>ID: 266 - DEMO PATIENT (M)</strong></p>
                    <p className="text-sm">Address: PUNE</p>
                    <p className="text-sm">Temp (deg): 35, BP: 120/80 mmHg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm"><strong>Date: 27-Apr-2020, 04:37 PM</strong></p>
                  </div>
                </div>
              </div>
              
              {/* Prescription Table */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">R</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1 pr-2">Medicine Name</th>
                      <th className="text-left py-1 px-2">Dosage</th>
                      <th className="text-left py-1 pl-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-1 pr-2">1) TAB. DEMO MEDICINE 1</td>
                      <td className="py-1 px-2">1 Morning, 1 Night<br/>(Before Food)</td>
                      <td className="py-1 pl-2">10 Days<br/>(Tot:20 Tab)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1 pr-2">2) CAP. DEMO MEDICINE 2</td>
                      <td className="py-1 px-2">1 Morning, 1 Night<br/>(Before Food)</td>
                      <td className="py-1 pl-2">10 Days<br/>(Tot:20 Cap)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1 pr-2">3) TAB. DEMO MEDICINE 3</td>
                      <td className="py-1 px-2">1 Morning, 1 Aft, 1 Eve, 1 Night<br/>(After Food)</td>
                      <td className="py-1 pl-2">10 Days<br/>(Tot:40 Tab)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1 pr-2">4) TAB. DEMO MEDICINE 4</td>
                      <td className="py-1 px-2">1/2 Morning, 1/2 Night<br/>(After Food)</td>
                      <td className="py-1 pl-2">10 Days<br/>(Tot:10 Tab)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Advice */}
              <div className="mb-4">
                <h3 className="font-bold mb-1">Advice Given:</h3>
                <p className="text-sm">* AVOID OILY AND SPICY FOOD</p>
              </div>
              
              {/* Follow Up */}
              <div className="mb-4">
                <p className="font-bold">Follow Up: 12-05-2020</p>
              </div>
              
              {/* Charts */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">Charts</h3>
                <div className="flex justify-between">
                  <div className="w-1/2 pr-2">
                    <p className="text-xs text-center">Temperature (deg F)</p>
                    <div className="h-24 border relative">
                      {/* Simple temperature chart */}
                      <svg viewBox="0 0 100 50" className="w-full h-full">
                        <polyline points="10,20 30,15 50,25 70,10" fill="none" stroke="red" strokeWidth="1" />
                        <text x="10" y="45" fontSize="6">23-02-2020</text>
                        <text x="70" y="45" fontSize="6">27-02-2020</text>
                      </svg>
                    </div>
                  </div>
                  <div className="w-1/2 pl-2">
                    <p className="text-xs text-center">Blood Pressure</p>
                    <div className="h-24 border relative">
                      {/* Simple BP chart */}
                      <svg viewBox="0 0 100 50" className="w-full h-full">
                        <polyline points="10,10 30,15 50,20 70,15" fill="none" stroke="blue" strokeWidth="1" />
                        <text x="10" y="45" fontSize="6">23-02-2020</text>
                        <text x="70" y="45" fontSize="6">27-02-2020</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Signature */}
              <div className="text-right mt-8">
                <p className="italic mb-1">Signature</p>
                <p className="font-bold">Dr. Onkar Bhave</p>
                <p className="text-sm">M.B.B.S., M.D., M.S.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptionPad;
