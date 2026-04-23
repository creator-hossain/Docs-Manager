
import React from 'react';
import { 
  MapPin, Map, Navigation, Home, 
  Mail, Send, Inbox, MessageSquare, 
  Phone, Smartphone, PhoneCall, Headset, 
  Globe, Link, ExternalLink, Monitor 
} from 'lucide-react';
import { BusinessDocument, DocumentType, FooterSettings, HeaderSettings } from '../types';

interface DocumentPreviewProps {
  document: BusinessDocument;
  containerRef?: React.RefObject<HTMLDivElement>;
  scale?: number;
  footerSettings?: FooterSettings;
  headerSettings?: HeaderSettings;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, containerRef, scale = 1, footerSettings, headerSettings }) => {
  const { 
    type, docNumber, date, clientName, clientAddress, clientPhone,
    clientDesignation, clientOffice, acName, logoUrl: docLogoUrl, logoSize: docLogoSize = 220, logoPosition: docLogoPosition = 0,
    vehicleTitle, vehicleTitleSize = 16, vehicleTitleAlign = 'left', brand, model, yearModel, color, chassisNumber, engineNumber, auctionPoint, cc, fuel, transmission,
    vehiclePrice, priceInWords, payments, quantity, notes, hiddenFields = [],
    advancedPaidAmount = 0, bankPaymentAmount = 0, bankName = "",
    productImageUrl, items = [], pageSettings
  } = document;

  const h = headerSettings || {
    text: 'Importer & All kinds of Brand new & Reconditioned Vehicles Supplier',
    fontSize: 14,
    fontFamily: 'serif',
    alignment: 'left',
    isItalic: true
  };

  const logoUrl = h.logoUrl || docLogoUrl;
  const logoSize = h.logoSize || docLogoSize;
  const logoPosition = h.logoPosition || docLogoPosition;

  const orientation = pageSettings?.orientation || 'portrait';
  const pageSize = pageSettings?.pageSize || 'a4';

  const getPageDimensions = () => {
    const sizes = {
      a4: { width: 210, height: 297 },
      letter: { width: 215.9, height: 279.4 },
      legal: { width: 215.9, height: 355.6 }
    };
    const base = sizes[pageSize as keyof typeof sizes] || sizes.a4;
    return orientation === 'portrait' 
      ? { width: `${base.width}mm`, height: `${base.height}mm` }
      : { width: `${base.height}mm`, height: `${base.width}mm` };
  };

  const dimensions = getPageDimensions();

  const isHidden = (id: string) => hiddenFields.includes(id);

  const isQuotation = type === DocumentType.QUOTATION;
  const isBill = type === DocumentType.BILL;
  const isChallan = type === DocumentType.CHALLAN;
  const isProInvoice = type === DocumentType.PRO_INVOICE;

  const formattedPrice = vehiclePrice > 0 ? new Intl.NumberFormat('en-IN').format(vehiclePrice) : "0";

  const commonA4Style: React.CSSProperties = {
    fontFamily: '"Times New Roman", Times, serif',
    width: dimensions.width,
    minHeight: dimensions.height,
    padding: '0',
    transform: scale !== 1 ? `scale(${scale})` : 'none',
    transformOrigin: 'top center',
    marginBottom: scale !== 1 ? `-${parseFloat(dimensions.height) * (1 - scale)}mm` : '10px',
    color: '#000000',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  };

  // Default fallback footer settings if none provided
  const f = footerSettings || {
    address: 'A.Hamid Road, Pabna',
    email: 'garirdokan2021@gmail.com',
    phone1: '+880 1713 110 570',
    phone2: '+880 1785 2555 86',
    website: 'garirdokan.com'
  };

  const renderWebsite = (url: string) => {
    // Logic to space out the website URL like "w w w . g a r i r d o k a n . c o m"
    // and highlight specific characters (g, d) in red if found
    const chars = url.toLowerCase().split('');
    const spaced = [];
    
    // Check if it's already spaced or has dots. Normalize to base domain.
    const domain = url.replace(/\s+/g, '');
    
    return (
      <div className="web-url text-[15px] mt-[5px] tracking-[4px] font-sans text-black lowercase text-center font-bold">
        {domain.split('').map((char, i) => (
          <React.Fragment key={i}>
            <span className={char === 'g' || char === 'd' ? 'text-red-600' : 'text-black'}>{char}</span>
            {i < domain.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const iconMap: Record<string, any> = {
    MapPin, Map, Navigation, Home,
    Mail, Send, Inbox, MessageSquare,
    Phone, Smartphone, PhoneCall, Headset,
    Globe, Link, ExternalLink, Monitor
  };

  const renderFooterIcon = (iconName: string | undefined, DefaultIcon: any) => {
    const Icon = (iconName && iconMap[iconName]) || DefaultIcon;
    return <Icon className="w-3 h-3 text-red-600" />;
  };

  const HeaderBar = () => {
    const h = headerSettings || {
      text: 'Importer & All kinds of Brand new & Reconditioned Vehicles Supplier',
      fontSize: 14,
      fontFamily: 'serif',
      alignment: 'left',
      isItalic: true
    };

    return (
      <div className="w-full bg-[#f3f4f6] py-2.5 px-4 border-y border-gray-300 mb-6" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div 
          style={{ 
            textAlign: h.alignment || 'left',
            fontSize: `${h.fontSize || 14}px`,
            fontFamily: h.fontFamily === 'serif' ? 'serif' : h.fontFamily === 'mono' ? 'monospace' : 'sans-serif',
            fontStyle: h.isItalic ? 'italic' : 'normal',
            color: '#374151',
            fontWeight: '600',
            lineHeight: '1.2',
            width: '100%',
            letterSpacing: '0',
            wordSpacing: '0',
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}
        >
          {h.text}
        </div>
      </div>
    );
  };

  const Footer = () => (
    <div 
      className="footer-container absolute left-0 right-0 text-center z-10 text-black"
      style={{ 
        bottom: `${f.bottomOffset ?? 10}mm`, 
        paddingLeft: `${f.horizontalPadding ?? 15}mm`, 
        paddingRight: `${f.horizontalPadding ?? 15}mm`,
        paddingTop: `${f.topPadding ?? 0}mm`,
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}
    >
      <div className="h-px bg-red-600/30 w-full" style={{ marginBottom: `${f.lineSpacing ?? 3}mm`, width: '100%' }}></div>
      <div className="text-[11px] text-black font-bold" style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', margin: '0 10px', verticalAlign: 'middle' }}>
          <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <span style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>{renderFooterIcon(f.addressIcon, MapPin)}</span> 
            <span style={{ verticalAlign: 'middle' }}>{f.address}</span>
          </span>
        </div>
        <div style={{ display: 'inline-block', margin: '0 10px', verticalAlign: 'middle' }}>
          <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <span style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>{renderFooterIcon(f.emailIcon, Mail)}</span> 
            <span style={{ verticalAlign: 'middle' }}>{f.email}</span>
          </span>
        </div>
        <div style={{ display: 'inline-block', margin: '0 10px', verticalAlign: 'middle' }}>
          <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <span style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>{renderFooterIcon(f.phone1Icon, Phone)}</span> 
            <span style={{ verticalAlign: 'middle' }}>{f.phone1}</span>
          </span>
        </div>
        {f.phone2 && (
          <div style={{ display: 'inline-block', margin: '0 10px', verticalAlign: 'middle' }}>
            <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
              <span style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>{renderFooterIcon(f.phone2Icon, Phone)}</span> 
              <span style={{ verticalAlign: 'middle' }}>{f.phone2}</span>
            </span>
          </div>
        )}
      </div>
      {renderWebsite(f.website)}
    </div>
  );

  // Render Product Invoice (Multi-row variant) - Precisely matched to OIL FILTER image
  if (isProInvoice) {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalPaid = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const balance = subtotal - totalPaid;
    const showImageColumn = !isHidden('itemImageColumn');

    const proInvoiceStyle: React.CSSProperties = {
      ...commonA4Style,
      fontFamily: '"Segoe UI", Arial, sans-serif',
      width: dimensions.width, // Ensure width is explicitly set
    };

    return (
      <div className="bg-[#525659] p-4 overflow-auto flex justify-center w-full">
        <div ref={containerRef} className="a4-page shadow-2xl relative bg-white !text-black" style={proInvoiceStyle}>
          <div className="flex pt-[5mm] mb-[5px] w-full" style={{ width: '100%' }}>
            <div className="logo-container" style={{ width: `${logoSize}px`, marginLeft: `${logoPosition}px`, flexShrink: 0 }}>
              {logoUrl && <img src={logoUrl} alt="Logo" className="w-full block" />}
            </div>
          </div>
          <HeaderBar />
          
          <div className="main-content px-[15mm] text-black flex-1 flex flex-col pb-[30mm]" style={{ width: '100%' }}>
            <div className="mb-6 border-b-[1.5px] border-black text-black pb-1" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
              <div style={{ float: 'left' }}>
                <h1 className="m-0 text-[32px] font-bold text-black uppercase whitespace-nowrap" style={{ lineHeight: '1', letterSpacing: '0' }}>INVOICE</h1>
              </div>
              <div style={{ float: 'right', marginTop: '15px' }}>
                <div className="text-[11px] font-bold text-black uppercase whitespace-nowrap" style={{ letterSpacing: '1px' }}>CUSTOMER COPY</div>
              </div>
              <div style={{ clear: 'both' }}></div>
            </div>

            <div className="mb-8 text-[14px] text-black" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
              <div className="text-black" style={{ width: '65%', float: 'left' }}>
                <div className="flex text-black items-start" style={{ width: '100%', marginBottom: '4px' }}>
                  <span className="font-bold text-black shrink-0" style={{ width: '110px' }}>Buyer's Name</span>
                  <span className="mr-2 text-black">:</span> 
                  <span className="font-bold uppercase flex-1 text-black">{clientName || '---'}</span>
                </div>
                <div className="flex text-black items-start" style={{ width: '100%', marginBottom: '4px' }}>
                  <span className="font-bold text-black shrink-0" style={{ width: '110px' }}>Phone</span>
                  <span className="mr-2 text-black">:</span> 
                  <span className="flex-1 text-black">{clientPhone || '---'}</span>
                </div>
                <div className="flex text-black items-start" style={{ width: '100%' }}>
                  <span className="font-bold text-black shrink-0" style={{ width: '110px' }}>Address</span>
                  <span className="mr-2 text-black">:</span> 
                  <span className="capitalize flex-1 leading-snug text-black">{clientAddress || '---'}</span>
                </div>
              </div>
              <div className="text-black" style={{ width: '35%', float: 'right', textAlign: 'right' }}>
                <div className="text-black" style={{ marginBottom: '4px' }}>
                  <span className="font-bold mr-2 text-black">DATE:</span> 
                  <span className="font-bold text-black whitespace-nowrap">{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</span>
                </div>
                <div className="text-black">
                  <span className="font-bold mr-2 text-black">Invoice no.:</span> 
                  <span className="font-bold text-black whitespace-nowrap">{docNumber}</span>
                </div>
              </div>
              <div style={{ clear: 'both' }}></div>
            </div>

            <table className="w-full border-collapse text-black" style={{ tableLayout: 'fixed', width: '100%' }}>
              <thead>
                <tr className="bg-white border-y-[1.5px] border-black">
                  <th className="p-2.5 text-center font-bold uppercase text-[12px] text-black" style={{ width: '10%', letterSpacing: '0' }}>SL NO</th>
                  <th className="p-2.5 text-left font-bold uppercase text-[12px] text-black" style={{ width: showImageColumn ? '32%' : '46%', paddingLeft: '15px', letterSpacing: '0' }}>DESCRIPTION</th>
                  {showImageColumn && <th className="p-2.5 text-center font-bold uppercase text-[12px] text-black" style={{ width: '14%', letterSpacing: '0' }}>IMAGE</th>}
                  <th className="p-2.5 text-center font-bold uppercase text-[12px] text-black" style={{ width: '10%', letterSpacing: '0' }}>QTY</th>
                  <th className="p-2.5 text-right font-bold uppercase text-[12px] text-black" style={{ width: '17%', paddingRight: '15px', letterSpacing: '0' }}>UNIT PRICE</th>
                  <th className="p-2.5 text-right font-bold uppercase text-[12px] text-black" style={{ width: '17%', paddingRight: '15px', letterSpacing: '0' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((item, index) => (
                  <tr key={item.id} className="text-black border-b border-gray-100 last:border-black last:border-b-[1.5px]">
                    <td className="p-3 text-center align-middle font-bold text-[13px] text-black whitespace-nowrap">{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="p-3 align-middle font-bold pl-4 text-[14px] text-black uppercase overflow-hidden truncate">
                      {item.description}
                    </td>
                    {showImageColumn && (
                      <td className="p-3 text-center align-middle">
                        {item.imageUrl && (
                          <div className={`mx-auto rounded-lg overflow-hidden border border-gray-100 shadow-sm ${
                            item.imageSize === 'small' ? 'w-10 h-10' : 
                            item.imageSize === 'medium' ? 'w-14 h-14' : 
                            'w-20 h-20'
                          }`}>
                            <img src={item.imageUrl} alt="Product" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </td>
                    )}
                    <td className="p-3 text-center align-middle font-bold text-[14px] text-black">{item.quantity}</td>
                    <td className="p-3 text-right align-middle font-bold pr-4 text-[14px] text-black">{item.unitPrice.toLocaleString()}/-</td>
                    <td className="p-3 text-right align-middle font-black pr-4 text-[15px] text-black">{(item.quantity * item.unitPrice).toLocaleString()}/-</td>
                  </tr>
                )) : (
                  <tr className="h-[100px] text-black border-b-[1.5px] border-black">
                    <td colSpan={showImageColumn ? 6 : 5} className="text-center text-black font-bold italic align-middle">No items added to invoice</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-8 text-black" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
              <div style={{ width: '350px', float: 'right' }}>
                <div className="mb-1 text-[16px] font-bold" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
                  <div className="text-right pr-4 uppercase" style={{ width: '180px', float: 'left', letterSpacing: '0' }}>Subtotal:</div>
                  <div className="text-right font-black" style={{ width: '150px', float: 'left', letterSpacing: '0' }}>{subtotal.toLocaleString()}/-</div>
                </div>
                <div className="mb-1 text-[16px] font-bold" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
                  <div className="text-right pr-4 uppercase" style={{ width: '180px', float: 'left', letterSpacing: '0' }}>Total Paid:</div>
                  <div className="text-right border-b border-gray-400 font-black" style={{ width: '150px', float: 'left', letterSpacing: '0' }}>{totalPaid.toLocaleString()}/-</div>
                </div>
                <div className="mt-2 text-[18px] font-bold" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
                  <div className="text-right pr-4 uppercase" style={{ width: '180px', float: 'left', letterSpacing: '0' }}>Balance:</div>
                  <div className="text-right bg-[#fff1f2] text-red-700 font-black px-2 py-1 rounded" style={{ width: '150px', float: 'left', letterSpacing: '0' }}>৳ {balance.toLocaleString()}/-</div>
                </div>
              </div>
              <div style={{ clear: 'both' }}></div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  // Render Delivery Challan - Custom Matched to Image Reference
  if (isChallan) {
    const challanStyle: React.CSSProperties = {
      ...commonA4Style,
      fontFamily: "'Courier Prime', monospace",
      color: '#000000',
      width: dimensions.width,
    };

    return (
      <div className="bg-[#525659] p-4 overflow-auto flex justify-center w-full">
        <div ref={containerRef} className="a4-page shadow-2xl relative overflow-hidden bg-white !text-black" style={challanStyle}>
          <div className="pt-[5mm] mb-[5px] w-full relative" style={{ width: '100%', height: '100px', display: 'block', overflow: 'hidden' }}>
            <div style={{ float: 'left', width: `${logoSize}px`, marginLeft: `${logoPosition}px` }}>
              {logoUrl && <img src={logoUrl} alt="Logo" style={{ width: '100%', display: 'block' }} />}
            </div>
            <div style={{ float: 'right', textAlign: 'right', paddingRight: '15mm' }}>
              <div style={{ color: '#d1d3d4', fontSize: '42px', fontFamily: 'sans-serif', fontWeight: '300', lineHeight: '1', letterSpacing: '2px', marginBottom: '2px' }}>DELIVERY</div>
              <div style={{ color: '#d1d3d4', fontSize: '42px', fontFamily: 'sans-serif', fontWeight: '300', lineHeight: '1', letterSpacing: '2px' }}>CHALLAN</div>
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>

          <HeaderBar />

          <div className="main-content px-[15mm] text-black flex-1 relative z-10 pb-[30mm]">
            <div className="mb-8 text-[16px] text-black" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
              <div style={{ float: 'left', width: '50%' }}>
                <div style={{ color: '#4b5563', marginBottom: '2px' }}>Invoice No:</div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#000000', marginBottom: '15px' }}>#{docNumber}</div>
                <div style={{ color: '#4b5563', marginBottom: '2px' }}>Date Issued:</div>
                <div style={{ fontWeight: 'bold', color: '#000000' }}>{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              </div>
              <div style={{ float: 'right', width: '45%', textAlign: 'left' }}>
                <div style={{ color: '#4b5563', marginBottom: '2px' }}>Issued to:</div>
                <div style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#000000' }}>{clientName}</div>
                <div style={{ marginTop: '5px' }}>
                  <span style={{ color: '#4b5563' }}>Cell:</span> <span style={{ color: '#000000', fontWeight: '500' }}>{clientPhone}</span>
                </div>
                <div style={{ marginTop: '2px' }}>
                  <span style={{ color: '#4b5563' }}>Adress:</span> <span style={{ color: '#000000', textTransform: 'capitalize', fontWeight: '500' }}>{clientAddress}</span>
                </div>
              </div>
              <div style={{ clear: 'both' }}></div>
            </div>

            <table className="w-full border-collapse mb-8 border border-[#bcbec0] text-black" style={{ tableLayout: 'fixed', width: '100%' }}>
              <thead>
                <tr className="bg-[#f1f2f2] text-black">
                  <th style={{ border: '1px solid #bcbec0', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', width: '80px', textTransform: 'uppercase' }}>NO</th>
                  <th style={{ border: '1px solid #bcbec0', padding: '10px 20px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>DESCRIPTION</th>
                  <th style={{ border: '1px solid #bcbec0', padding: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', width: '120px', textTransform: 'uppercase' }}>QTY</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ minHeight: '350px' }}>
                  <td style={{ border: '1px solid #bcbec0', padding: '15px', textAlign: 'center', verticalAlign: 'top' }}>1</td>
                  <td style={{ border: '1px solid #bcbec0', padding: '20px', verticalAlign: 'top' }}>
                    <div 
                      style={{ 
                        textTransform: 'uppercase', 
                        fontWeight: 'bold', 
                        marginBottom: '20px', 
                        lineHeight: '1.2', 
                        fontSize: `${vehicleTitleSize}px`, 
                        textAlign: vehicleTitleAlign || 'left' as any,
                        letterSpacing: '0px'
                      }}
                    >
                      {vehicleTitle}
                    </div>
                    <div style={{ marginTop: '20px', fontSize: '15px' }}>
                      <div style={{ display: 'block', marginBottom: '8px', overflow: 'hidden' }}>
                        <span style={{ float: 'left', width: '160px', fontWeight: 'bold' }}>| COLOR</span>
                        <span style={{ float: 'left', marginRight: '8px' }}>:</span>
                        <span style={{ float: 'left' }}>{color}</span>
                      </div>
                      <div style={{ display: 'block', marginBottom: '8px', overflow: 'hidden' }}>
                        <span style={{ float: 'left', width: '160px', fontWeight: 'bold' }}>| MODEL</span>
                        <span style={{ float: 'left', marginRight: '8px' }}>:</span>
                        <span style={{ float: 'left' }}>{yearModel}</span>
                      </div>
                      <div style={{ display: 'block', marginBottom: '8px', overflow: 'hidden' }}>
                        <span style={{ float: 'left', width: '160px', fontWeight: 'bold' }}>| Engine No</span>
                        <span style={{ float: 'left', marginRight: '8px' }}>:</span>
                        <span style={{ float: 'left' }}>{engineNumber}</span>
                      </div>
                      <div style={{ display: 'block', marginBottom: '8px', overflow: 'hidden' }}>
                        <span style={{ float: 'left', width: '160px', fontWeight: 'bold' }}>| AUCTION POINT</span>
                        <span style={{ float: 'left', marginRight: '8px' }}>:</span>
                        <span style={{ float: 'left' }}>{auctionPoint || '---'}</span>
                      </div>
                      <div style={{ display: 'block', marginBottom: '8px', overflow: 'hidden' }}>
                        <span style={{ float: 'left', width: '160px', fontWeight: 'bold' }}>| Chassis No</span>
                        <span style={{ float: 'left', marginRight: '8px' }}>:</span>
                        <span style={{ float: 'left' }}>{chassisNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ border: '1px solid #bcbec0', padding: '15px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold', fontSize: '18px' }}>
                    {quantity < 10 ? `0${quantity}` : quantity}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-10 text-black">
              <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>Customer Acknowledgment of Vehicle Condition:</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', textAlign: 'justify', marginBottom: '30px', letterSpacing: '0px', wordSpacing: '0.5px' }}>
                I, {clientName}, hereby acknowledge that I have received the vehicle with all the required paper documentation and I confirm that the vehicle has been delivered in complete and good condition. I have inspected the vehicle and found it to be satisfactory in all aspects, including its physical and mechanical condition. I have no complaints regarding the state of the vehicle at the time of delivery.
              </p>
            </div>

            <div className="mt-20 pt-10" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
              <div style={{ float: 'left', width: '250px', textAlign: 'center', borderTop: '1px solid #000000', paddingTop: '8px' }}>
                <span className="text-[15px] font-bold text-black">Received By</span>
              </div>
              <div style={{ float: 'right', width: '250px', textAlign: 'center', borderTop: '1px solid #000000', paddingTop: '8px' }}>
                <span className="text-[15px] font-bold text-black">Proprietor</span>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    );
  }

  // Render Bill
  if (isBill) {
    return (
      <div className="bg-[#525659] p-4 overflow-auto flex justify-center w-full">
        <div ref={containerRef} className="a4-page shadow-2xl relative bg-white !text-black" style={{...commonA4Style, width: dimensions.width}}>
          <div className="flex pt-[5mm] mb-[5px] w-full text-black" style={{ width: '100%' }}>
            <div className="logo-container" style={{ width: `${logoSize}px`, marginLeft: `${logoPosition}px`, flexShrink: 0 }}>
              {logoUrl && <img src={logoUrl} alt="Logo" className="w-full block" />}
            </div>
          </div>
          <HeaderBar />
          <div className="main-content px-[20mm] text-black flex-1 relative pb-[30mm]">
            <div className="text-center font-bold uppercase mt-[-10px] mb-[15px] text-[22px] text-black">BILL</div>
            <div className="mb-[25px] leading-[1.2] text-[17px] text-black">
              To,<br />
              <div className="flex flex-col text-black">
                <span className="text-black font-bold">{acName ? `A/C: ${acName}` : clientName}</span>
                {clientDesignation && <span className="text-black font-bold">{clientDesignation},</span>}
                {clientOffice && <span className="text-black font-bold">{clientOffice}</span>}
                <div className="whitespace-pre-wrap text-black capitalize">{clientAddress}</div>
              </div>
            </div>
            <div className="font-bold mb-[30px] text-black" style={{ fontSize: `${vehicleTitleSize}px` }}>Sub: Bill for {vehicleTitle}</div>
            <div className="relative text-black">
              <table className="w-full border-collapse mb-[25px] border border-black relative z-[1] text-black">
                <thead>
                  <tr className="bg-white h-[45px] text-black">
                    <th className="border border-black p-2 text-center font-bold w-[55%] text-[17px] text-black bg-white uppercase">DESCRIPTION OF VEHICLE</th>
                    <th className="border border-black p-2 text-center font-bold w-[15%] text-[17px] text-black bg-white uppercase">Unit</th>
                    <th className="border border-black p-2 text-center font-bold w-[30%] text-[16px] text-black bg-white uppercase whitespace-nowrap">TOTAL AMOUNT (TK)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-black">
                    <td className="border-x border-black px-6 pt-8 pb-8 align-top text-black min-h-[400px]">
                      <div className="specs-block space-y-2 text-[20px] text-black">
                        <div className="flex text-black">
                           <span className="font-bold text-black w-[140px] shrink-0">Vehicle</span>
                           <span className="text-black w-[25px] shrink-0">:</span>
                           <span className="font-bold text-black flex-1">{formattedPrice}/-</span>
                        </div>
                        {!isHidden('yearModel') && <div className="flex text-black"><span className="text-black w-[140px] shrink-0">Year</span><span className="text-black w-[25px] shrink-0">:</span><span className="text-black flex-1">{yearModel}</span></div>}
                        {!isHidden('cc') && <div className="flex text-black"><span className="text-black w-[140px] shrink-0">CC.</span><span className="text-black w-[25px] shrink-0">:</span><span className="text-black flex-1">{cc}</span></div>}
                        {!isHidden('engineNumber') && <div className="flex text-black"><span className="text-black w-[140px] shrink-0">Engine No.</span><span className="text-black w-[25px] shrink-0">:</span><span className="text-black flex-1">{engineNumber}</span></div>}
                        {!isHidden('chassisNumber') && <div className="flex text-black"><span className="text-black w-[140px] shrink-0">Chassis No</span><span className="text-black w-[25px] shrink-0">:</span><span className="text-black flex-1">{chassisNumber}</span></div>}
                        {!isHidden('color') && <div className="flex text-black"><span className="text-black w-[140px] shrink-0">Color</span><span className="text-black w-[25px] shrink-0">:</span><span className="text-black flex-1">{color}</span></div>}
                      </div>
                    </td>
                    <td className="border-x border-black px-3 pt-8 text-center align-middle font-bold text-[22px] text-black">
                      {quantity < 10 ? `0${quantity}` : quantity}
                    </td>
                    <td className="border-x border-black px-6 pt-8 text-right align-middle text-[20px] text-black font-bold"></td>
                  </tr>
                  <tr className="text-black h-[40px] border-t border-black">
                    <td colSpan={2} className="border-r border-black px-6 text-left text-[16px] text-black align-middle">
                      Advance Paid By Customer
                    </td>
                    <td className="px-6 text-right text-[17px] text-black align-middle font-bold">
                      {advancedPaidAmount > 0 ? `${new Intl.NumberFormat('en-IN').format(advancedPaidAmount)}/-` : '-'}
                    </td>
                  </tr>
                  <tr className="text-black h-[40px] border-t border-black">
                    <td colSpan={2} className="border-r border-black px-6 text-left text-[16px] text-black align-middle">
                      Paid by {bankName || 'Bank Name'}
                    </td>
                    <td className="px-6 text-right text-[17px] text-black align-middle font-bold">
                      {bankPaymentAmount > 0 ? `${new Intl.NumberFormat('en-IN').format(bankPaymentAmount)}/-` : '-'}
                    </td>
                  </tr>
                  <tr className="font-bold border-t border-black text-black h-[55px]">
                    <td colSpan={2} className="border border-black px-6 text-left text-[18px] uppercase text-black align-middle">NET PRICE IN TAKA</td>
                    <td className="border border-black px-6 text-right text-[20px] text-black align-middle">{formattedPrice}/-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-[19px] mt-[25px] text-black">
              <span className="font-bold text-black">Price in words : {priceInWords}</span>
            </div>
            <div className="text-[19px] font-bold text-black mt-[25px]">
              Yours Faithfully,
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // Render Quotation 
  if (isQuotation) {
    const challanStyle: React.CSSProperties = {
      ...commonA4Style,
      fontFamily: '"Segoe UI", Arial, sans-serif',
      width: dimensions.width,
    };

    return (
      <div className="bg-[#525659] p-4 overflow-auto flex justify-center w-full">
        <div ref={containerRef} className="a4-page shadow-2xl relative overflow-hidden bg-white !text-black" style={challanStyle}>
          <div className="pt-[5mm] mb-[5px] w-full relative" style={{ width: '100%', height: '80px', display: 'block', overflow: 'hidden' }}>
            <div style={{ float: 'left', width: `${logoSize}px`, marginLeft: `${logoPosition}px` }}>
              {logoUrl && <img src={logoUrl} alt="Logo" style={{ width: '100%', display: 'block' }} />}
            </div>
            <div style={{ clear: 'both' }}></div>
          </div>

          <HeaderBar />

          <div className="main-content px-[20mm] text-black" style={{ width: '100%', boxSizing: 'border-box' }}>
            <div 
              style={{ 
                fontWeight: 'bold', 
                textTransform: 'uppercase', 
                marginTop: '10px', 
                marginBottom: '20px', 
                fontSize: `${vehicleTitleSize}px`, 
                textAlign: vehicleTitleAlign || 'left' as any,
                lineHeight: '1.2'
              }}
            >
              QUOTATION FOR <span className="uppercase text-black">{vehicleTitle}</span>
            </div>
            <div className="mb-[15px] leading-[1.4] text-[15px] text-black" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
              <div style={{ width: '65%', float: 'left' }}>
                To,<br />
                {clientDesignation && <span className="text-black">{clientDesignation}<br /></span>}
                {clientOffice && <span className="text-black">{clientOffice}<br /></span>}
                {clientAddress && <div className="whitespace-pre-wrap text-black capitalize">{clientAddress}</div>}
                {acName && <div className="mt-1 text-black font-bold">A/C: {acName}</div>}
              </div>
              <div style={{ width: '35%', float: 'right', textAlign: 'right' }}>
                {!isHidden('date') && <div>Date: {new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</div>}
              </div>
              <div style={{ clear: 'both' }}></div>
            </div>
            <div className="mb-[15px] text-[15px] text-black">
              Dear Sir,<br />
              <span style={{ display: 'block', marginTop: '5px' }}>We have the pleasure to offer you the under mentioned vehicle with the following terms & conditions.</span>
            </div>
            <div className="relative text-black">
               <table className="main-table w-full border-collapse mb-[15px] border border-black relative z-[1] text-black">
                <thead>
                  <tr className="bg-white text-black">
                    <th className="border border-black p-2 text-center font-bold w-[65%] text-[15px] text-black bg-white uppercase">DESCRIPTION OF VEHICLE</th>
                    <th className="border border-black p-2 text-center font-bold w-[10%] text-[15px] text-black bg-white uppercase">QTY</th>
                    <th className="border border-black p-2 text-center font-bold w-[25%] text-[15px] text-black bg-white whitespace-nowrap uppercase">TOTAL AMOUNT (TK)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-black">
                    <td className="border border-black p-2 align-top text-black">
                      <ul className="spec-list list-none m-0 p-0 leading-[1.5] text-[15px] text-black">
                        {!isHidden('brand') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">Brand Name</span><span className="text-black">: </span>{brand}</li>}
                        {!isHidden('model') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">Model</span><span className="text-black">: </span>{model}</li>}
                        {!isHidden('yearModel') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">Year Model</span><span className="text-black">: </span>{yearModel}</li>}
                        {!isHidden('color') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">Color</span><span className="text-black">: </span>{color}</li>}
                        {!isHidden('chassisNumber') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">Chassis No</span><span className="text-black">: </span>{chassisNumber}</li>}
                        {!isHidden('engineNumber') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">Engine No</span><span className="text-black">: </span>{engineNumber}</li>}
                        {!isHidden('cc') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">C.C</span><span className="text-black">: </span>{cc}</li>}
                        {!isHidden('fuel') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">Fuel</span><span className="text-black">: </span>{fuel}</li>}
                        {!isHidden('transmission') && <li className="text-black"><span className="inline-block w-[110px] font-bold text-black">Transmission</span><span className="text-black">: </span>{transmission}</li>}
                      </ul>
                    </td>
                    <td className="border border-black p-2 text-center align-middle text-black">{!isHidden('quantity') && (quantity < 10 ? `0${quantity}` : quantity)}</td>
                    <td className="border border-black p-2 text-right text-[18px] font-bold align-middle text-black">{formattedPrice}/-</td>
                  </tr>
                  <tr className="net-price-row font-bold text-black">
                    <td colSpan={2} className="border border-black p-2 text-left uppercase text-[15px] text-black">NET PRICE IN TAKA</td>
                    <td className="border border-black p-2 text-right text-[16px] text-black">{formattedPrice}/-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="price-words-row mb-[15px] text-[15px] text-black"><span className="font-bold text-black">Price in words :</span> {priceInWords}</div>
            {notes && (<div className="accessories-box mt-[10px] mb-[15px] leading-[1.4] text-justify text-[14px] text-black"><span className="font-bold text-black">Fitting Accessories:</span> {notes}</div>)}
            <div className="mt-[10px] text-[15px] leading-[1.4] text-black"><p className="text-black">Price excluding REGISTRATION cost.<br /><span className="font-bold uppercase text-black">Yours Faithfully,</span></p></div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // Invoice Render (Default Standard / CAR SALE INVOICE)
  const totalPaidAmount = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
  const balanceAmount = (vehiclePrice || 0) - totalPaidAmount;

  return (
    <div className="bg-gray-100 p-4 overflow-auto flex justify-center w-full">
      <div 
        ref={containerRef} 
        className="a4-page shadow-2xl relative bg-white !text-black" 
        style={{ 
          fontFamily: '"Segoe UI", Arial, sans-serif',
          width: dimensions.width,
          minHeight: dimensions.height,
          padding: '0', 
          transform: scale !== 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'top center',
          marginBottom: scale !== 1 ? `-${parseFloat(dimensions.height) * (1 - scale)}mm` : '10px',
          color: '#000000',
          position: 'relative',
          backgroundColor: 'white',
          boxSizing: 'border-box'
        }}
      >
        <div className="text-black" style={{ width: '100%' }}>
          <div className="flex pt-[5mm] mb-[5px] w-full text-black" style={{ width: '100%' }}>
            <div className="logo-container" style={{ width: `${logoSize}px`, marginLeft: `${logoPosition}px`, flexShrink: 0 }}>
              {logoUrl && <img src={logoUrl} alt="Logo" className="w-full block" />}
            </div>
          </div>
          <HeaderBar />
          <div className="px-[15mm] pt-[5mm] text-black" style={{ width: '100%' }}>
            <div className="mb-4 relative text-black border-b border-black" style={{ width: '100%', height: '45px' }}>
              <h1 className="absolute left-0 bottom-0 m-0 text-[32px] font-bold text-black whitespace-nowrap">INVOICE</h1>
              <div className="absolute right-0 bottom-1 text-[11px] font-bold text-black uppercase whitespace-nowrap">CUSTOMER COPY</div>
            </div>
            <div className="mb-8 text-[14px] text-black" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
              <div className="text-black" style={{ width: '65%', float: 'left' }}>
                {!isHidden('clientName') && (
                  <div className="flex text-black items-start" style={{ width: '100%', marginBottom: '4px' }}>
                    <span className="font-bold text-black shrink-0" style={{ width: '110px' }}>Buyer's Name</span>
                    <span className="mr-2 text-black">:</span> 
                    <span className="uppercase flex-1 text-black font-bold">{clientName}</span>
                  </div>
                )}
                {!isHidden('clientPhone') && (
                  <div className="flex text-black items-start" style={{ width: '100%', marginBottom: '4px' }}>
                    <span className="font-bold text-black shrink-0" style={{ width: '110px' }}>Phone</span>
                    <span className="mr-2 text-black">:</span> 
                    <span className="flex-1 text-black">{clientPhone}</span>
                  </div>
                )}
                {!isHidden('clientAddress') && (
                  <div className="flex text-black items-start" style={{ width: '100%' }}>
                    <span className="font-bold text-black shrink-0" style={{ width: '110px' }}>Address</span>
                    <span className="mr-2 text-black">:</span> 
                    <span className="capitalize flex-1 text-black leading-tight">{clientAddress}</span>
                  </div>
                )}
              </div>
              <div className="text-black" style={{ width: '35%', float: 'right', textAlign: 'right' }}>
                <div className="text-black" style={{ marginBottom: '4px' }}>
                  <span className="font-bold mr-2 text-black">DATE:</span> 
                  <span className="text-black whitespace-nowrap">{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</span>
                </div>
                <div className="text-black">
                  <span className="font-bold mr-2 text-black">Invoice no.:</span> 
                  <span className="text-black whitespace-nowrap">{docNumber}</span>
                </div>
              </div>
              <div style={{ clear: 'both' }}></div>
            </div>
            <table className="w-full border-collapse text-black" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="text-black">
                  <th className="border-y-[1.5px] border-black py-2.5 pl-[80px] pr-1.5 text-left text-[14px] font-bold text-black bg-white border-x-0 uppercase" style={{ width: '45%' }}>DESCRIPTION</th>
                  <th className="border-y-[1.5px] border-black py-2.5 px-1.5 text-left text-[14px] font-bold text-black bg-white border-x-0 uppercase" style={{ width: '35%' }}>PAYMENT DATE</th>
                  <th className="border-y-[1.5px] border-black py-2.5 px-1.5 text-right text-[14px] font-bold text-black bg-white border-x-0 uppercase" style={{ width: '20%' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-black">
                  <td className="w-[45%] align-top pt-4 pr-2 text-black">
                    {!isHidden('vehicleTitle') && <span className="font-bold uppercase mb-4 block leading-tight text-black" style={{ fontSize: `${vehicleTitleSize}px` }}>{vehicleTitle}</span>}
                    {productImageUrl && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 max-w-[200px] shadow-sm">
                        <img src={productImageUrl} alt="Product" className="w-full h-auto block" />
                      </div>
                    )}
                    <div className="space-y-1 text-[14px] text-black">
                      {!isHidden('model') && <div className="flex text-black"><span className="text-black w-[80px] shrink-0">Model</span><span className="text-black w-[10px] shrink-0">:</span><span className="text-black flex-1">{model}</span></div>}
                      {!isHidden('color') && <div className="flex text-black"><span className="text-black w-[80px] shrink-0">Color</span><span className="text-black w-[10px] shrink-0">:</span><span className="text-black flex-1">{color}</span></div>}
                      {!isHidden('cc') && <div className="flex text-black"><span className="text-black w-[80px] shrink-0">CC</span><span className="text-black w-[10px] shrink-0">:</span><span className="text-black flex-1">{cc}</span></div>}
                      {!isHidden('chassisNumber') && <div className="flex text-black"><span className="text-black w-[80px] shrink-0">Chassis no</span><span className="text-black w-[10px] shrink-0">:</span><span className="text-black flex-1">{chassisNumber}</span></div>}
                      {!isHidden('engineNumber') && <div className="flex text-black"><span className="text-black w-[80px] shrink-0">Engine no</span><span className="text-black w-[10px] shrink-0">:</span><span className="text-black flex-1">{engineNumber}</span></div>}
                    </div>
                    <br />
                    {!isHidden('vehiclePrice') && (
                      <div className="text-black" style={{ marginTop: '15px' }}>
                      <strong className="text-[15px] text-black" style={{ display: 'block' }}>Car price : {vehiclePrice.toLocaleString()}/-</strong>
                      <span className="text-[13px] font-normal text-black" style={{ display: 'block', marginTop: '4px' }}>(Excluding registration fee)</span>
                    </div>
                    )}
                  </td>
                  <td colSpan={2} className="p-0 align-top border-l border-gray-200 text-black">
                    {payments?.map((p, index) => (
                      <div key={p.id} className={`flex ${index === payments.length - 1 ? '' : 'border-b border-gray-200'} text-black`}>
                        <div className="w-[63.6%] py-3 px-2 text-[13px] text-black align-top">
                          {new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
                        </div>
                        <div className="w-[36.4%] text-right py-3 px-2 text-black">
                          <span className="font-bold block text-[13px] text-black">{p.amount.toLocaleString()}/-</span>
                          <span className="text-[11px] text-[#555] italic block mt-0.5 uppercase">{p.note}</span>
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-0 border-t-[1.5px] border-black pt-2.5 text-black" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
              <div className="text-black" style={{ width: '300px', float: 'right' }}>
                <div className="mb-1 text-[15px] text-black" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
                  <div className="font-bold text-black" style={{ width: '120px', float: 'left', textAlign: 'right', paddingRight: '20px' }}>Total Paid:</div>
                  <div className="font-bold text-black border-b border-[#ddd]" style={{ width: '140px', float: 'left', textAlign: 'right' }}>{totalPaidAmount.toLocaleString()}/-</div>
                </div>
                <div className="font-bold text-[15px] text-black" style={{ width: '100%', display: 'block', overflow: 'hidden' }}>
                  <div className="text-black" style={{ width: '120px', float: 'left', textAlign: 'right', paddingRight: '20px' }}>Balance:</div>
                  <div className="text-black border-b border-[#ddd]" style={{ width: '140px', float: 'left', textAlign: 'right' }}>{balanceAmount.toLocaleString()}/-</div>
                </div>
              </div>
              <div style={{ clear: 'both' }}></div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
