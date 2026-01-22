<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="rounded-2xl p-6 lg:p-8 border" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
    <h2 class="text-3xl lg:text-4xl font-extrabold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Rights & Obligations</h2>
    
         <p class="text-lg mb-8" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
       All successful GCX members will undergo initial training on Exchange products and services, rules and regulations, and trading through the Exchange.
     </p>

           <!-- Download Card at Top -->
      <div class="mb-8 relative overflow-hidden rounded-2xl shadow-lg" :class="isDarkMode ? 'bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-600/30' : 'bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200'">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5" :class="isDarkMode ? 'bg-yellow-400' : 'bg-yellow-600'">
          <svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div class="relative p-6 lg:p-8">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <!-- Left Content -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="p-2 rounded-lg" :class="isDarkMode ? 'bg-yellow-600/20' : 'bg-yellow-500/10'">
                  <svg class="w-6 h-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-xl font-bold" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">Complete Rules & Obligations</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Official GCX membership documentation</p>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Comprehensive membership requirements</span>
                </div>
                <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Rights and privileges details</span>
                </div>
                <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Compliance and conduct guidelines</span>
                </div>
              </div>
            </div>
            
            <!-- Right Actions -->
            <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a href="/gcx_rules_obligations.pdf" target="_blank" 
                 class="group relative inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                 :class="isDarkMode ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-600/25' : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/25'">
                <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Download PDF</span>
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              
              <button @click="scrollToBottom" 
                      class="group inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-200"
                      :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500' : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'">
                <svg class="w-5 h-5 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
                <span>Read Full Content</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    <!-- 1. Membership Requirement -->
    <section class="mb-8">
      <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">1. Membership Requirement</h3>
      <h4 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'">1.1 Documents to submit</h4>
      <div class="text-lg leading-relaxed divide-y mb-4" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Certified copy of Company / Cooperative Registration Certificate</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Certified copy of Companies Regulations</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Board Resolution on appointing authorized signatories</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Education qualification certificates of authorized signatories, certified by a Notary public officer</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Proof of experience of the authorized signatories in the form of CVs</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Address, communication details of the authorized signatories (National ID card/ Passport copy, telephone, cell, and email)</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Bank account details and a current Bank Statement displaying the past 6 months</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Copy of tax clearance certificate / VAT registration certificate</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Two latest passport size colored photographs for authorized person(s)</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Current police report of the authorized signatories</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Latest Auditors Report</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Any other document, as may be specified by the Exchange</span></div>
      </div>
      <p class="text-lg mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">1.2 An applicant shall submit a processing fee as specified herein the application form. In the case that this processing fee is not paid, GCX reserves the right to reject this Membership Application.</p>
      <p class="text-lg mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">GCX reserves the right to accept or reject any Membership Application, or amend the Terms and Conditions without assigning any reason whatsoever.</p>
      <p class="text-lg" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">Membership shall be subject to renewal every two-years on GCX applicable rate.</p>
    </section>

    <!-- 2.1 Eligibility for Exchange Membership -->
    <section class="mb-8">
      <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.1 Eligibility for Exchange Membership</h3>
      <h4 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'">2.1.1 A business organization, Corporation, or Cooperative, may only be admitted to membership if it:</h4>
      <div class="text-lg leading-relaxed divide-y mb-4" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Has been recognised as a market intermediary by the SEC</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Is duly incorporated under the Laws of Ghana or the country in which it is registered</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Complies with the capital adequacy norms as may be prescribed by the Exchange, from time to time</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Complies with the membership registration requirements as may be prescribed by the Exchange from time to time</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Provides a valid Tax Identification Number and Tax Clearance. If it is VAT registered, then it must also provide a VAT registration certificate</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Pays Membership fees, charges, deposits and other related payments specified by the Exchange</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Has produced an audited financial statement from an authorized auditor certifying the minimum requirement for net worth according to the class of Membership</span></div>
        <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Submits a copy of the memorandum and articles of association</span></div>
      </div>
             <p class="text-lg mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">2.1.2 An organization seeking membership in the Exchange may only be admitted to membership if the purpose for which the organization is established allows it to carry on business in commodities or to clear and settle transactions or contracts in commodities.</p>
       <p class="text-lg" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">2.1.3 If there is any change in the shareholding of a member of the Exchange which is not acceptable to the Exchange, the Exchange may take such action as it may deem appropriate, including expelling the organization from membership in the Exchange.</p>
     </section>

     <!-- 2.2 Admission of Members -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.2 Admission of Members</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>2.2.1 An applicant for Membership in the Exchange shall submit an application to the Exchange, providing all necessary information and documents as requested by the Exchange, together with any admission fee as determined by the Exchange. The admission fee paid by the Member shall be non-refundable.</p>
         <p>2.2.2 The application shall include an undertaking, signed by a duly authorized officer of the applicant, in a form specified by the Exchange, that the organization applying for Membership agrees to be bound by these Rules and regulations and directives issued by the Exchange.</p>
         <p>2.2.3 The Exchange shall consider the application and may call for any further information it considers necessary.</p>
         <p>2.2.4 If an application for Membership is rejected, the Exchange will provide reasoning for its decision to reject the application within a period of fifteen (15) working days from the day that all the required application materials were received. The applicant may appeal the decision to the Board within a period of fourteen (14) working days of receiving the Exchange's reasoning for denial of membership. The Board shall decide at its next general or specially constituted meeting, by majority vote, whether the applicant is qualified for Membership. The decision of the Board shall be final.</p>
         <p>2.2.5 In determining whether to approve an application, the Exchange shall be entitled to consider the business integrity, financial soundness and standard of training and experience of the company's managers and directors, partners, officers and employees, and such other matters as the Exchange regards as relevant.</p>
         <p>2.2.6 The Exchange shall be entitled to investigate issues related to the financial and managerial integrity of applicants for membership through on-site visits, interviews, document authentication, and other measures necessary to verify the information provided in the application.</p>
         <p>2.2.7 An applicant may, during the admission process, appear personally before the Board or any Committee thereof, for an interview or test administered by the Exchange as may be prescribed.</p>
       </div>
     </section>

     <!-- 2.3 Rights and Privileges of Members -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.3 Rights and Privileges of Members</h3>
       <div class="text-lg leading-relaxed divide-y" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
         <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Membership shall entitle a Member to certain rights and privileges, subject to these Rules and the other regulations as applicable from time to time</span></div>
         <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Membership of the Exchange shall entitle a Member to access to organized commodity trading</span></div>
         <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Membership of the Exchange shall entitle a Member to some access to data disseminated by the Exchange</span></div>
         <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>A Member may be invited to events hosted by the Exchange</span></div>
         <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>A Member shall have a right to advertise as an Exchange-accredited organization</span></div>
         <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>A Member shall be entitled to use the Ghana Commodity Exchange logo upon approval by the Exchange</span></div>
       </div>
     </section>

     <!-- 2.4 Registration under Misrepresentation -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.4 Registration under Misrepresentation</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>The Exchange may expel a Member if such Member has, in its application for Membership or during the course of the inquiry made by the Exchange pursuant to the application:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Made any wilful misrepresentation</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Suppressed or concealed any material information required of the applicant with regard to financial position, including financial liabilities, character and antecedents</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Has directly or indirectly given false information or made a false declaration</span></div>
         </div>
       </div>
     </section>

     <!-- 2.5 Procedure Subsequent to Admission -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.5 Procedure Subsequent to Admission</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>2.5.1 When a new Member of the Exchange is registered, the Exchange shall send verification of the registration to the Member.</p>
         <p>2.5.2 Upon payment of any required fees and completion of other registration requirements as may be prescribed by these Rules, the Exchange shall issue a Certificate of Membership, membership number and ID Card under the common seal of the Exchange to the newly registered Member.</p>
         <p>2.5.3 If a Certificate or ID card is lost, destroyed, defaced or damaged, the Exchange may issue a new Certificate or ID card under the condition that the damaged certificate or ID card is returned to the Exchange, or proof of the destruction or loss of the original certificate or ID card is presented to the Exchange. The Exchange may require the Member to pay a replacement fee before the issue of any such duplicate certificate or ID card is given out.</p>
         <p>2.5.4 When a Member of the Exchange is admitted and a Certificate of Membership, membership number and ID card are issued, notice of the Member's admission shall be published on the notice board of the Exchange or by way of another system as determined by the Exchange.</p>
       </div>
     </section>

     <!-- 2.6 Register of Members -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.6 Register of Members</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>2.6.1 The Exchange shall maintain a register and index of Members. In the register, the Exchange shall collect and record information about the style, constitution and other specified information about the Members for the use of the Exchange. All details provided by the Members of the Exchange shall be stored appropriately and confidentially in electronic form and in hard copies.</p>
         <p>A Member shall promptly notify the Exchange in writing about any change in the registered information within fourteen (14) working days provided by the Member of the Exchange at the time of admission or at a later stage. In the event that a Member fails to do make the required changes, the Exchange shall charge the Member a penalty or take further disciplinary action as may be required.</p>
       </div>
     </section>

     <!-- 2.7 Termination of Membership -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.7 Termination of Membership</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>2.7.1 With prior consultation and approval of the Authority; or as directed by the Authority for non-compliance or violation of the rules or the Law, the Exchange may terminate membership if any of the following circumstances occurs:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Dissolution of the Member company</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Expulsion of the Member in accordance with these Rules</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Resignation by the Member in writing</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>The Member is declared in default in accordance with these Rules</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Becoming ineligible for Membership under these Rules</span></div>
         </div>
       </div>
     </section>

     <!-- 2.8 Declaration of Default -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.8 Declaration of Default</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>2.8.1 A Member of the Exchange shall be declared in default by the Exchange if the monies, commodities, securities and bank guarantees deposited by the Member with the Exchange are not adequate to discharge the Member's obligations and liabilities. A Member of the Exchange shall also be declared in default upon the occurrence of any of the following:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>The Member is unable to fulfil its engagements or obligations</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>If an instruction issued by the Exchange for debiting the Member's account towards settlement of a trade fails because of insufficient funds in its designated bank account</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>If a Member fails to pay damages or the money difference due on a closing out effected against him under these Rules</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>If a Member fails to pay or deliver money, commodities or instruments arising out of an award given by an Arbitrator under the Arbitration proceedings provided for in these Rules</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>If a Member fails to pay or deliver money, commodities or instruments arising out of a transaction executed on the Exchange, provided the obligation is not disputed by a trading member or client</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>If a Member fails to pay a subscription, or any other levy as required by the Exchange for a continuous period of thirty (30) working days</span></div>
         </div>
         <p class="mt-4">2.8.2 In case a Member does not clear its liability on the Exchange and the amount of the liability exceeds the amount of other assets it has available with the Exchange, then the Exchange may declare the person in default until the Member clears its liabilities.</p>
         <p>2.8.3 When a Member is declared in default, the Exchange shall publish a notice of default on the Exchange website.</p>
         <p>2.8.4 Once a Member is declared in default, the Member shall cease to be a Member of the Exchange.</p>
       </div>
     </section>

     <!-- 2.9 The Exchange's Rights in Lieu of Suspension or Expulsion -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.9 The Exchange's Rights in Lieu of Suspension or Expulsion</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>2.9.1 With prior consultation and approval of the SEC, the Exchange may suspend a Member of the Exchange in lieu of the expulsion, or may remove Membership rights or impose a fine in lieu of suspension or expulsion. The Exchange may subject the Member to any other alternative penalty on fair and equitable terms and conditions.</p>
         <p>2.9.2 With prior consultation and approval of the SEC, the Exchange may of its own motion or on appeal by a Member of the Exchange concerned in the matter, reconsider and rescind, revoke or modify a decision withdrawing any Membership rights, or fining, censuring, warning, or suspending any Member of the Exchange.</p>
         <p>2.9.3 Provided that any expulsion, suspension or other penalty is imposed in accordance with the directions of the authority issued in exercise of any powers conferred on them by Law, the Exchange shall not exercise the power to rescind, revoke or modify the same, except with the previous sanction of the authority that made the original decision.</p>
       </div>
     </section>

     <!-- 2.10 Effect of Suspension of Member of the Exchange -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.10 Effect of Suspension of Member of the Exchange</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>2.10.1 The suspension of a Member of the Exchange shall have the following consequences:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>The suspended Member of the Exchange shall, during the term of its suspension, be deprived of all rights and excluded from all privileges of Membership of the Exchange</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>During a suspension, a Member may be proceeded against by the Exchange or another relevant authority for any offence committed either before or after the suspension</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>A suspension shall not affect the rights of the Exchange or other Members of the Exchange who are creditors of the suspended Member of the Exchange</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>A suspended Member is bound to fulfil contracts outstanding at the time of its suspension</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>A suspended Member shall not, during the term of its suspension, clear or register any contracts at the Exchange, although it may, with the permission of the Exchange, close transactions outstanding at the time of its suspension through other Members of the Exchange</span></div>
         </div>
       </div>
     </section>

     <!-- 2.11 Effect of Expulsion of a Member of the Exchange -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.11 Effect of Expulsion of a Member of the Exchange</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>The expulsion of a Member of the Exchange shall have the following consequences:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>An expelled Member shall forfeit to the Exchange its rights and privileges as a Member of the Exchange, including any right to use or claim upon any interest in property or funds with the Exchange</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Any liability to the Exchange of an expelled Member shall continue and remain unaffected by the expulsion</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>The expulsion shall not affect the rights of the Exchange or Members of the Exchange who are creditors of the expelled Member</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>The expelled Member shall be bound to fulfil transactions outstanding at the time of its expulsion and may, with the permission of the Exchange or the relevant authority, close outstanding transactions with or through other Members of the Exchange</span></div>
         </div>
       </div>
     </section>

     <!-- 2.12 Compliance with Rules and Code of Conduct -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">2.12 Compliance with Rules and Code of Conduct</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>2.12.1 A Member shall be bound by the Code of Conduct, and any violation of the Code of Conduct gives rise to a right of suspension or expulsion. In compliance with the Code of Conduct, a Member agrees to:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Ensure that its authorized representatives comply with these Rules and other regulations of the Exchange</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Notify the Exchange immediately upon becoming aware that it or its authorized representatives have breached a provision of these Rules or any other regulations or law relating to the Exchange</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Notify the Exchange immediately upon becoming aware that a regulatory body is investigating or instituting proceedings against it</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Cooperate with the Exchange or persons appointed by the Exchange in allowing the Exchange to carry out inspection of records concerning the Member's trading and financial position, whether on its own account or on behalf of its clients</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Comply with requests of a Settlement Bank to inspect its records, when the request is made in coordination with the Exchange</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Authorize the Exchange to provide information requested by the SEC relating to the operations of the Exchange or a Member, and outstanding obligations held by a Member</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Give access to the SEC or the Exchange to enter its offices upon request for the purposes of supervision and monitoring compliance with these Rules or any other Rules issued by the Exchange or the Authority</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Not assign any mortgage, pledge, hypothecate, or charge its rights and privileges of Membership</span></div>
         </div>
       </div>
     </section>

     <!-- 3.14 Conduct of Members -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">3.14 Conduct of Members</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>3.14.1 Every Member of the Exchange shall promote, to the best of its ability, the objects and interests of the Exchange and to protect and safeguard the interests of its Clients.</p>
         <p>3.14.2 A Member shall be liable to expulsion, suspension or to payment of a fine for a violation of Rules.</p>
         <p>3.14.3 A Member shall furnish to all potential and current clients a risk disclosure statement or other statement as prescribed by the Exchange. This statement shall contain a disclosure of the risks related to trading.</p>
         <p>3.14.4 A Member shall require all clients to read and sign the risk disclosure or other required statement before agreeing to participate in trading.</p>
         <p>3.14.5 A Member is responsible for knowing the contents of all Rules, notices, circulars, orders and instructions issued by the Exchange, and shall also provide all relevant information to clients before executing any order on behalf of the client.</p>
         <p>3.14.6 A Member shall not encourage, abet, or allow a client to evade any financial or non-financial compliance requirement with respect to trading on the Exchange.</p>
         <p>3.14.7 A Member shall provide to its clients written disclosure of information pertinent to trade as specified and required by the Exchange.</p>
         <p>3.14.8 A Member shall explain the role of the Clearing House of the Exchange and the scope and benefits of the same to its clients.</p>
       </div>
     </section>

     <!-- 3.15 Expulsion, Suspension, and Fines -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">3.15 Expulsion, Suspension, and Fines</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>3.15.1 The Exchange may expel, suspend, or levy a fine on a Member when the Member commits any of the following acts or omissions:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Refusal to abide by an award: neglecting or refusing to submit to, abide by or carry out any award, decision or order of an arbitrator, the Exchange or the SEC, made in conformity with these Rules</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Unbecoming conduct: acting in a manner detrimental to the interests of the Exchange</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Misconduct: conducting disreputable or fraudulent transactions with any person, whether a Member or not</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Disobedience: violating, disobeying or disregarding any Law, regulation, order, ordinance or notification issued by the Authority in respect of trading in commodities</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Misinformation: publishing or permitting to be published in a newspaper, circular, or otherwise, any misrepresentation relating to the trade in any commodities that is intended to mislead Members of the Exchange or the public</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Indifference and wilful negligence: failing to comply with any notice or request made by or on behalf of the Exchange or the Authority requiring a Member to attend any meeting of the Board or management, or a request to produce any books, documents, correspondence or other papers in its possession, power or control, or for refusing or neglecting to answer a request from the Exchange or the Authority</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Failure to pay dues: failing to pay an amount due under these Rules, other regulations, or an arbitration award or under any other order of the Exchange or the Authority within ten (10) days after the amount is due</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Action detrimental to the Exchange: misconduct in dealings or relations with the Exchange</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Wilful or intentional non–fulfilment of contractual obligations: fraudulent or flagrant breach of contract, or frivolous repudiation of a contractual obligation</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Ex parte communication with an arbitrator: communicating secretly or indirectly with any arbitrator to whom a dispute has been referred under these Rules</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Unauthorized disclosure: disclosure of one client's open position to other clients or Members</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Harming the reputation of the Exchange: any action which, in the opinion of the Board brings the Exchange into disrepute</span></div>
         </div>
         <p class="mt-4">3.15.2 If the Exchange finds sufficient reason to investigate a suspected act or omission by a Member that would rendering the Member liable to expulsion, suspension or payment of a fine, the Exchange shall give written notice to the Member to appear before the Exchange for a disciplinary hearing at a specified time.</p>
         <p>3.15.3 At a disciplinary hearing, the Exchange shall hear and examine evidence or statements of the Member and any witnesses present on its behalf. The Exchange may also require the Member to produce for inspection books, documents, correspondence or papers in its possession or under its control.</p>
         <p>3.15.4 The disciplinary measures shall be administered in the following manner:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Whenever the Exchange finds that a Member is liable to expulsion, the Exchange may expel the Member permanently and exclude it from all rights of Membership, except the right to arbitrate matters entered into or arising prior to the expulsion. The Member shall have a right to appeal the decision of expulsion to the Authority.</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Whenever the Exchange finds that a Member is liable to suspension or payment of a fine, the Exchange may suspend the Member from all rights of Membership, except the right to arbitrate matters entered into or arising prior to the suspension. Any such decision of the Exchange shall a right of appeal to the Authority</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>In addition to suspension or in lieu thereof, the Exchange may, at its discretion, fine a Member up to maximum amount of 50% of Membership fees.</span></div>
         </div>
         <p class="mt-4">3.15.5 If a Member is suspended, expelled or declared in default, no other Member of the Exchange shall do business for or on behalf of the Member.</p>
       </div>
     </section>

     <!-- 3.16 Maintenance of Accounting Records -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">3.16 Maintenance of Accounting Records</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>3.16.1 A Member shall maintain accounting records for a period of not less than ten (10) years that meet the following standards:</p>
         <div class="text-lg leading-relaxed divide-y mt-2" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Accurately record and explain the transactions and financial position of that Member</span></div>
           <div class="py-2.5 flex items-start gap-3"><span class="mt-1 text-yellow-600">›</span><span>Enable the Exchange to easily ascertain the Member's compliance with these Rules</span></div>
         </div>
         <p class="mt-4">3.16.2 A Member shall maintain records in a form and at a location that will enable the Exchange or any other authorized body to conveniently and properly audit them.</p>
       </div>
     </section>

     <!-- 4. Contracts -->
     <section class="mb-8">
       <h3 class="text-2xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-900'">4. Contracts</h3>
       <div class="text-lg leading-relaxed space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
         <p>4.1 A Member shall trade in contracts only as approved by the SEC and the Exchange Board of Directors.</p>
         <p>4.2 Members shall be required to sign a written agreement with a client to trade a contract on behalf of a client.</p>
         <p>4.3 All transactions in contracts permitted by the Board of Directors shall be cleared, registered and settled by the Exchange, and shall be subject to these Rules.</p>
         <p>4.4 In respect of contracts executed by Members, the Member shall be responsible to pay all applicable fees, taxes and duties.</p>
         <p>4.5 Only contracts for commodities that are authorized to be traded on the Exchange will be recognized as valid in and by the Exchange, provided the Member has enough money in its Pay-in Account to cover the transaction.</p>
         <p>4.6 Trading unit, tick size, and daily position limit for a contract authorized for trading in the Exchange shall be quoted in accordance with standards specified for that contract and shall be the grade of the commodity for that contract.</p>
         <p>4.7 The Exchange shall set minimum and maximum position limits for contracts relating to each commodity class traded per day or other set period. All position limit changes require the approval of the Board.</p>
         <p>4.8 A transaction in contracts for commodities shall be for delivery at one or more delivery warehouses approved by the Exchange.</p>
         <p>4.9 The Board shall have the right to determine, specify and modify the terms and manner of delivery of a commodity resulting from a transaction in contracts in the commodity class.</p>
         <p>4.10 The Board may modify the quantity, packaging, place of delivery, discounts, premiums related to quality and delivery warehouses, tender period, certification and quotation for bids and offers.</p>
         <p>4.11 Members shall only enter into contracts that the Authority and the Board of Directors has approved, and under terms and conditions approved by the Exchange.</p>
       </div>
     </section>

     <div class="pt-4">
             <a href="/gcx_rules_obligations.pdf" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border transition"
          :class="isDarkMode ? 'text-yellow-300 border-yellow-700 hover:bg-yellow-900/20' : 'text-yellow-700 border-yellow-300 hover:bg-yellow-50'">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
         </svg>
         Click here to download a copy of the GCX Rules & Obligations
       </a>
    </div>
  </div>
</template>
 
