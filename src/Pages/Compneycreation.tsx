import { useState } from "react";
import Field from "../Components/Field";
import Select from "../Components/Select";
import Section from "../Components/Section";
import { AiTwotoneCloseSquare } from "react-icons/ai";


const Compneycreation = () => {
 
  const countrynames = ["India", "USA", "UK", "Canada", "Australia", "Pakistan", "Germany", "France", "Italy", "Spain", "Brazil", "Mexico", "China"];
  const countrystates = {
    India: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "Rajasthan"],
    USA: ["California", "Texas", "Florida", "New York", "Illinois"],
    UK: ["England", "Scotland", "Wales", "Northern Ireland"],
    Canada: ["Ontario", "Quebec", "British Columbia", "Alberta"],
    Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
    Pakistan: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"],
    Germany: ["Bavaria", "Berlin", "Hamburg", "Hesse"],
    France: ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes"],
    Italy: ["Lombardy", "Lazio", "Campania", "Sicily"],
    Spain: ["Andalusia", "Catalonia", "Madrid", "Valencia"],
    Brazil: ["São Paulo", "Rio de Janeiro", "Bahia", "Paraná"],
    Mexico: ["Jalisco", "Nuevo León", "Puebla", "Guanajuato"],
    China: ["Guangdong", "Beijing", "Shanghai", "Zhejiang"],
  };
   const currencysymbols = ["₹", "$", "£", "$", "$", "₨", "€", "€", "€", "€", "R$", "$", "¥"];

  const [directory, setdirectory] = useState("")
  const [name, setname] = useState("")

  {/* Primary Mailing Details States */ }
  const [malingname, setmalingname] = useState("")
  const [address, setaddress] = useState("")
  const [country, setcountry] = useState(countrynames[0])
  const [state, setstate] = useState(countrystates[countrynames[0] as keyof typeof countrystates][0])
  const [pincode, setpincode] = useState("")

  {/* Contact Details States */ }
 const [phonenumber, setphonenumber] = useState("")
 const [mobilenumber, setmobilenumber] = useState("")
 const [faxnumber, setfaxnumber] = useState("")
 const [email, setemail] = useState("")
 const [website, setwebsite] = useState("")

  {/* Books and Financial Year Details States */ }
  const [financialyear, setfinancialyear] = useState("")
  const [booksbeginning, setbooksbeginning] = useState("")

  {/* Security Control States */ }
  const [tallyvaultpassword, settallyvaultpassword] = useState("")
  const [repeatpassword, setrepeatpassword] = useState("")
  const [usesecuritycontrol, setusesecuritycontrol] = useState("")

 
  {/* Base Currency Information States */ }
  const [basecurrencysymbol, setbasecurrencysymbol] = useState( currencysymbols[countrynames.indexOf(country)] )
  const [formalname, setformalname] = useState("")
  const [suffixsymboltoamount, setsuffixsymboltoamount] = useState("")
  const [addspacebetweenamountandsymbol, setaddspacebetweenamountandsymbol] = useState("")
  const [showamountinmillions, setshowamountinmillions] = useState("")
  const [numberofdecimalplaces, setnumberofdecimalplaces] = useState("")
  const [wordafterdecimal, setwordafterdecimal] = useState("")
  const [decimalplacesinwords, setdecimalplacesinwords] = useState("")


  
  return (
    <div className="flex-1 bg-surface p-6 overflow-auto transition-colors">
      <div className="w-full py-4 flex items-center justify-between bg-surface">
        <div>
          <h1 className="capitalize text-black text-2xl  font-bold">
            Compney Creation
          </h1>
          <p><span className="text-red-500">*</span> Represent required feilds </p>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-muted">Ctrl + M</h1>
          <button className="text-2xl text-[var(--text)]">
            <AiTwotoneCloseSquare className="w-8 h-8" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* LEFT */}
        <div>
          <Field
            label="Directory"
            type="text"
            onChange={(e) => setdirectory(e)}
            value={directory}
          />

          {/* Primary Mailing Details Section */}
          <Section title="Primary Mailing Details">
            <Field
              label="Mailing name"
              type="text"
              onChange={(e) => setmalingname(e)}
              required
              value={malingname}
            />
            <Field
              label="Address"
              type="text"
              onChange={(e) => setaddress(e)}
              value={address}
              required
            />
            <Select
              label="Country"
              options={countrynames}
              value={country}
              onChange={(e) => setcountry(e)}
              required
            />
            <Select
              label="State"
              options={countrystates[country as keyof typeof countrystates]}
              value={state}
              onChange={(e) => setstate(e)}
              required
            />
            <Field
              label="Pincode"
              type="text"
              value={pincode}
              onChange={(e) => setpincode(e)}
            />
          </Section>

          {/* Contact Details Section */}
          <Section title="Contact Details">
            <Field
              label="Phone no."
              type="tel"
              onChange={(e) => setphonenumber(e)}
              value={phonenumber}
              required
            />
            <Field
              label="Mobile no."
              type="tel"
              onChange={(e) => setmobilenumber(e)}
              value={mobilenumber}
              required
            />
            <Field
              label="Fax no."
              type="tel"
              onChange={(e) => setfaxnumber(e)}
              value={faxnumber}
            />
            <Field
              label="E-mail"
              type="email"
              onChange={(e) => setemail(e)}
              value={email}
              required
            />
            <Field
              label="Website"
              type="url"
              onChange={(e) => setwebsite(e)}
              value={website}
            />
          </Section>
        </div>

        {/* RIGHT */}
        <div>
          <Field
            label="Name"
            type="text"
            onChange={(e) => setname(e)}
            value={name}
            required
          />
          {/* Books and Financial Year Details Section */}
          <Section title="Books and Financial Year Details">
            <Field
              label="Financial year begins from"
              type="date"
              value={financialyear}
              onChange={(e) => setfinancialyear(e)}
              required
            />
            <Field
              label="Books beginning from"
              type="date"
              value={booksbeginning}
              onChange={(e) => setbooksbeginning(e)}
              required
            />
          </Section>

          {/* Security Control Section */}
          <Section title="Security Control">
            <Field
              label="TallyVault password (if any)"
              type="password"
              onChange={(e) => settallyvaultpassword(e)}
              value={tallyvaultpassword}
            />
            <Field
              label="Repeat password"
              type="password"
              onChange={(e) => setrepeatpassword(e)}
              value={repeatpassword}
            />
            <p className="text-md italic">
              (Warning: Forgetting TallyVault password will render your data
              inaccessible)
            </p>
            <Select
              label="Use security control?"
              options={["No", "Yes"]}
              value={usesecuritycontrol}
              onChange={(e) => setusesecuritycontrol(e)}
            />
          </Section>
          <p className="text-md italic">
            (Enable security to avail TSS features)
          </p>
        </div>
      </div>

      {/* Base Currency Information Section */}
      <Section title="Base Currency Information">
        <div className="grid grid-cols-2 gap-x-8">
          <Select
            label="Base currency symbol"
            options={[currencysymbols[countrynames.indexOf(country)]]}
            value={basecurrencysymbol}
            onChange={(e) => setbasecurrencysymbol(e)}
          />
          <Field
            label="Formal name"
            type="text"
            value={formalname}
            onChange={(e) => setformalname(e)}
          />
          <Select
            label="Suffix symbol to amount"
            options={["Yes", "No"]}
            value={suffixsymboltoamount}
            onChange={(e) => setsuffixsymboltoamount(e)}
          />
          <Select
            label="Add space between amount and symbol"
            options={["Yes", "No"]}
            value={addspacebetweenamountandsymbol}
            onChange={(e) => setaddspacebetweenamountandsymbol(e)}
          />
          <Select
            label="Show amount in millions"
            options={["Yes", "No"]}
            value={showamountinmillions}
            onChange={(e) => setshowamountinmillions(e)}
          />

          <Field
            label="Number of decimal places"
            type="number"
            value={numberofdecimalplaces}
            onChange={(e) => setnumberofdecimalplaces(e)}
          />
          <Field
            label="Word after decimal"
            type="text"
            value={wordafterdecimal}
            onChange={(e) => setwordafterdecimal(e)}
          />
          <Field
            label="Decimal places in words"
            type="number"
            value={decimalplacesinwords}
            onChange={(e) => setdecimalplacesinwords(e)}
          />
        </div>
      </Section>
    </div>
  );
};

export default Compneycreation;
