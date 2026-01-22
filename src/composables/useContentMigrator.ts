import { ref, reactive } from 'vue'
import axios from '../plugins/axios'

export interface ContentItem {
  key: string
  label: string
  type: 'text' | 'html' | 'image' | 'url'
  fallback: string
  description: string
  group: string
}

export interface PageContent {
  pageId: string
  title: string
  description: string
  items: ContentItem[]
}

export function useContentMigrator() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const migrationStatus = reactive<Record<string, 'pending' | 'success' | 'error'>>({})

  // Define all the content that should be CMS-editable
  const pageContents: PageContent[] = [
    {
      pageId: 'about',
      title: 'About Page',
      description: 'Content for the About GCX page',
      items: [
        {
          key: 'about_title',
          label: 'About Section Title',
          type: 'text',
          fallback: 'About GCX',
          description: 'Main title for the about section',
          group: 'about'
        },
        {
          key: 'about_description',
          label: 'About Description',
          type: 'html',
          fallback: 'The Ghana Commodity Exchange is a private company limited by shares, structured as a Public-Private Partnership, with the Government of Ghana currently the sole shareholder. The Exchange aims to establish linkages between agricultural and commodity producers and buyers, secure competitive prices for their products, assure the market quantity and quality, and settle trade promptly.',
          description: 'Main description about GCX',
          group: 'about'
        },
        {
          key: 'ceo_name',
          label: 'CEO Name',
          type: 'text',
          fallback: 'Mr. Robert Dowuona Owoo',
          description: 'Name of the Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'ceo_title',
          label: 'CEO Title',
          type: 'text',
          fallback: 'Acting Chief Executive Officer',
          description: 'Title of the Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'ceo_image',
          label: 'CEO Image',
          type: 'image',
          fallback: '/Mr. Robert Dowuona Owoo.jpeg',
          description: 'Image of the Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'ceo_intro',
          label: 'CEO Introduction',
          type: 'text',
          fallback: 'Ghana Commodity Exchange\'s Management team is led by Mr. Robert Dowuona Owooi, the Acting Chief Executive Officer.',
          description: 'Introduction text for the CEO',
          group: 'leadership'
        },
        {
          key: 'key_goal_title',
          label: 'Key Goal Title',
          type: 'text',
          fallback: 'Our Key Goal',
          description: 'Title for the key goal section',
          group: 'goals'
        },
        {
          key: 'key_goal_description',
          label: 'Key Goal Description',
          type: 'html',
          fallback: 'To link Ghanaian smallholder farmers to agricultural and financial markets in Ghana and across the West Africa Region to ensure Ghana farmers secure competitive prices for their commodities, as well as supply good quality commodities which meet the nutritional needs of the Ghanaian people.',
          description: 'Description of GCX key goal',
          group: 'goals'
        },
        // Mission content
        {
          key: 'mission_title',
          label: 'Mission Title',
          type: 'text',
          fallback: 'Mission',
          description: 'Mission page main title',
          group: 'mission'
        },
        {
          key: 'mission_subtitle',
          label: 'Mission Subtitle',
          type: 'html',
          fallback: 'Ghana Commodity Exchange (GCX) is a leading commodity exchange platform dedicated to transforming agricultural trading in Ghana and West Africa.',
          description: 'Mission page subtitle',
          group: 'mission'
        },
        {
          key: 'our_mission_title',
          label: 'Our Mission Title',
          type: 'text',
          fallback: 'Our Mission',
          description: 'Our Mission section title',
          group: 'mission'
        },
        {
          key: 'our_mission_text1',
          label: 'Our Mission Text 1',
          type: 'html',
          fallback: 'We provide innovative solutions for farmers, traders, and stakeholders, ensuring transparency, efficiency, and growth in the agricultural sector.',
          description: 'First paragraph of our mission',
          group: 'mission'
        },
        {
          key: 'our_mission_text2',
          label: 'Our Mission Text 2',
          type: 'html',
          fallback: 'Through our regulated marketplace, we connect agricultural producers with buyers, enabling fair pricing and secure transactions.',
          description: 'Second paragraph of our mission',
          group: 'mission'
        },
        {
          key: 'our_mission_text3',
          label: 'Our Mission Text 3',
          type: 'html',
          fallback: 'Our platform ensures quality assurance, timely delivery, and reliable settlement for all market participants.',
          description: 'Third paragraph of our mission',
          group: 'mission'
        },
        {
          key: 'values_title',
          label: 'Values Title',
          type: 'text',
          fallback: 'Our Core Values',
          description: 'Core values section title',
          group: 'mission'
        },
        {
          key: 'transparency_title',
          label: 'Transparency Title',
          type: 'text',
          fallback: 'Transparency',
          description: 'Transparency value title',
          group: 'mission'
        },
        {
          key: 'transparency_text',
          label: 'Transparency Text',
          type: 'html',
          fallback: 'Open and fair trading practices with clear pricing mechanisms',
          description: 'Transparency value description',
          group: 'mission'
        },
        {
          key: 'efficiency_title',
          label: 'Efficiency Title',
          type: 'text',
          fallback: 'Efficiency',
          description: 'Efficiency value title',
          group: 'mission'
        },
        {
          key: 'efficiency_text',
          label: 'Efficiency Text',
          type: 'html',
          fallback: 'Streamlined processes for optimal market performance',
          description: 'Efficiency value description',
          group: 'mission'
        },
        {
          key: 'statistics_title',
          label: 'Statistics Title',
          type: 'text',
          fallback: 'Agricultural Trading',
          description: 'Statistics section title',
          group: 'mission'
        },
        {
          key: 'farmers_count',
          label: 'Farmers Count',
          type: 'text',
          fallback: '50K+',
          description: 'Number of farmers connected',
          group: 'mission'
        },
        {
          key: 'farmers_label',
          label: 'Farmers Label',
          type: 'text',
          fallback: 'Farmers Connected',
          description: 'Label for farmers statistic',
          group: 'mission'
        },
        {
          key: 'mission_image',
          label: 'Mission Image',
          type: 'image',
          fallback: '/Service/testing.jpg',
          description: 'Mission page main image',
          group: 'mission'
        },
        {
          key: 'mission_image_alt',
          label: 'Mission Image Alt Text',
          type: 'text',
          fallback: 'GCX Mission',
          description: 'Alt text for mission image',
          group: 'mission'
        },
        {
          key: 'statistics_image',
          label: 'Statistics Image',
          type: 'image',
          fallback: '/crop.jpg',
          description: 'Statistics section image',
          group: 'mission'
        },
        {
          key: 'statistics_image_alt',
          label: 'Statistics Image Alt Text',
          type: 'text',
          fallback: 'Agricultural Statistics',
          description: 'Alt text for statistics image',
          group: 'mission'
        },
        // Vision, Purpose & Objectives Section
        {
          key: 'vision_purpose_title',
          label: 'Vision Purpose Title',
          type: 'text',
          fallback: 'Our Vision, Purpose & Objectives',
          description: 'Main title for Vision, Purpose & Objectives section',
          group: 'vision'
        },
        {
          key: 'vision_purpose_subtitle',
          label: 'Vision Purpose Subtitle',
          type: 'text',
          fallback: 'Driving Ghana\'s economic transformation through innovative commodity trading solutions',
          description: 'Subtitle for Vision, Purpose & Objectives section',
          group: 'vision'
        },
        {
          key: 'vision_title',
          label: 'Vision Title',
          type: 'text',
          fallback: 'Our Vision',
          description: 'Title for the vision section',
          group: 'vision'
        },
        {
          key: 'vision_description',
          label: 'Vision Description',
          type: 'html',
          fallback: 'To transform Ghana\'s economy by creating prosperity for all in commodity value chains and become a regional and global trading hub for all commodities.',
          description: 'Description of GCX vision',
          group: 'vision'
        },
        {
          key: 'purpose_title',
          label: 'Purpose Title',
          type: 'text',
          fallback: 'Our Purpose',
          description: 'Title for the purpose section',
          group: 'vision'
        },
        {
          key: 'purpose_description',
          label: 'Purpose Description',
          type: 'html',
          fallback: 'To connect markets, connect people & provide opportunities through innovation; using the most interactive and appropriate technology that meets the needs of our stakeholders and honouring earth\'s resources through sustainable practices across our business.',
          description: 'Description of GCX purpose',
          group: 'vision'
        },
        {
          key: 'objectives_title',
          label: 'Objectives Title',
          type: 'text',
          fallback: 'Our Objectives',
          description: 'Title for the objectives section',
          group: 'vision'
        },
        {
          key: 'objective_1',
          label: 'Objective 1',
          type: 'html',
          fallback: 'Provide liquid, efficient markets for instruments such as auctions, spot, forward, futures and options',
          description: 'First objective',
          group: 'vision'
        },
        {
          key: 'objective_2',
          label: 'Objective 2',
          type: 'html',
          fallback: 'Support access to finance through efficient linkages along the value chain',
          description: 'Second objective',
          group: 'vision'
        },
        {
          key: 'objective_3',
          label: 'Objective 3',
          type: 'html',
          fallback: 'Build capacity of members to use GCX infrastructure',
          description: 'Third objective',
          group: 'vision'
        },
        {
          key: 'objective_4',
          label: 'Objective 4',
          type: 'html',
          fallback: 'Establish fair and transparent price discovery mechanisms',
          description: 'Fourth objective',
          group: 'vision'
        },
        {
          key: 'objective_5',
          label: 'Objective 5',
          type: 'html',
          fallback: 'Ensure market integrity through rigorous surveillance systems',
          description: 'Fifth objective',
          group: 'vision'
        },
        {
          key: 'objective_6',
          label: 'Objective 6',
          type: 'html',
          fallback: 'Develop standards, contracts, and dispute mechanisms to reduce risk',
          description: 'Sixth objective',
          group: 'vision'
        },
        {
          key: 'objective_7',
          label: 'Objective 7',
          type: 'html',
          fallback: 'Implement a reliable, efficient, and guaranteed clearing & settlement system',
          description: 'Seventh objective',
          group: 'vision'
        },
        // Leadership Team Section
        {
          key: 'leadership_title',
          label: 'Leadership Title',
          type: 'text',
          fallback: 'Leadership Team',
          description: 'Main title for leadership team section',
          group: 'leadership'
        },
        {
          key: 'leadership_subtitle',
          label: 'Leadership Subtitle',
          type: 'text',
          fallback: 'Experienced leaders driving Ghana Commodity Exchange\'s strategic vision and operational excellence.',
          description: 'Subtitle for leadership team section',
          group: 'leadership'
        },
        {
          key: 'ceo_title',
          label: 'CEO Title',
          type: 'text',
          fallback: 'Acting Chief Executive Officer',
          description: 'Title of the Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'ceo_image',
          label: 'CEO Image',
          type: 'image',
          fallback: '/Mr. Robert Dowuona Owoo.jpeg',
          description: 'Image of the Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'ceo_bio',
          label: 'CEO Bio',
          type: 'html',
          fallback: 'Experienced leader with extensive background in commodity trading and financial markets.',
          description: 'Biography of the Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'deputy_ceo_name',
          label: 'Deputy CEO Name',
          type: 'text',
          fallback: 'Ms. Ophelia Martekuo Atoklo',
          description: 'Name of the Deputy Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'deputy_ceo_title',
          label: 'Deputy CEO Title',
          type: 'text',
          fallback: 'Acting Deputy Chief Executive Officer',
          description: 'Title of the Deputy Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'deputy_ceo_image',
          label: 'Deputy CEO Image',
          type: 'image',
          fallback: '/Ms. Ophelia Martekuo Atoklo \'Deputy Chief Executive Officer\'.jpg',
          description: 'Image of the Deputy Chief Executive Officer',
          group: 'leadership'
        },
        {
          key: 'deputy_ceo_bio',
          label: 'Deputy CEO Bio',
          type: 'html',
          fallback: 'Strategic leader with deep expertise in operational excellence and stakeholder management.',
          description: 'Biography of the Deputy Chief Executive Officer',
          group: 'leadership'
        },
        // Board of Directors Section
        {
          key: 'board_title',
          label: 'Board Title',
          type: 'text',
          fallback: 'Board of Directors',
          description: 'Main title for Board of Directors section',
          group: 'board'
        },
        {
          key: 'board_subtitle',
          label: 'Board Subtitle',
          type: 'text',
          fallback: 'Governance and strategic oversight by experienced industry leaders',
          description: 'Subtitle for Board of Directors section',
          group: 'board'
        },
        // Board Chairman
        {
          key: 'chairman_name',
          label: 'Chairman Name',
          type: 'text',
          fallback: 'Mr. Kofi S. Yamoah',
          description: 'Name of the Board Chairman',
          group: 'board'
        },
        {
          key: 'chairman_title',
          label: 'Chairman Title',
          type: 'text',
          fallback: 'Board Chairman',
          description: 'Title of the Board Chairman',
          group: 'board'
        },
        {
          key: 'chairman_image',
          label: 'Chairman Image',
          type: 'image',
          fallback: '/Board of directors/Mr. Kofi S. Yamoah \'Board Chairman\'.png',
          description: 'Image of the Board Chairman',
          group: 'board'
        },
        {
          key: 'chairman_bio',
          label: 'Chairman Bio',
          type: 'html',
          fallback: 'Experienced leader providing strategic direction and governance oversight.',
          description: 'Biography of the Board Chairman',
          group: 'board'
        },
        // Non-Executive Director 1
        {
          key: 'director1_name',
          label: 'Director 1 Name',
          type: 'text',
          fallback: 'Mr. Kwame Daaku',
          description: 'Name of the first non-executive director',
          group: 'board'
        },
        {
          key: 'director1_title',
          label: 'Director 1 Title',
          type: 'text',
          fallback: 'Non-Executive Director',
          description: 'Title of the first non-executive director',
          group: 'board'
        },
        {
          key: 'director1_image',
          label: 'Director 1 Image',
          type: 'image',
          fallback: '/Board of directors/Mr. Kwame Daaku \'Non-excutive director\'.jpg',
          description: 'Image of the first non-executive director',
          group: 'board'
        },
        {
          key: 'director1_bio',
          label: 'Director 1 Bio',
          type: 'html',
          fallback: 'Independent director bringing valuable industry expertise and governance experience.',
          description: 'Biography of the first non-executive director',
          group: 'board'
        },
        // Non-Executive Director 2
        {
          key: 'director2_name',
          label: 'Director 2 Name',
          type: 'text',
          fallback: 'Mr. Stephen Antwi-Asimeng',
          description: 'Name of the second non-executive director',
          group: 'board'
        },
        {
          key: 'director2_title',
          label: 'Director 2 Title',
          type: 'text',
          fallback: 'Non-Executive Director',
          description: 'Title of the second non-executive director',
          group: 'board'
        },
        {
          key: 'director2_image',
          label: 'Director 2 Image',
          type: 'image',
          fallback: '/Board of directors/Mr. Stephen Antwi-Asimeng \' non-excutive director\'.png',
          description: 'Image of the second non-executive director',
          group: 'board'
        },
        {
          key: 'director2_bio',
          label: 'Director 2 Bio',
          type: 'html',
          fallback: 'Independent director with extensive experience in financial markets and corporate governance.',
          description: 'Biography of the second non-executive director',
          group: 'board'
        },
        // Board Secretary
        {
          key: 'secretary_name',
          label: 'Secretary Name',
          type: 'text',
          fallback: 'Mrs. Wendy Malm',
          description: 'Name of the Board Secretary',
          group: 'board'
        },
        {
          key: 'secretary_title',
          label: 'Secretary Title',
          type: 'text',
          fallback: 'Board Secretary',
          description: 'Title of the Board Secretary',
          group: 'board'
        },
        {
          key: 'secretary_image',
          label: 'Secretary Image',
          type: 'image',
          fallback: '/Board of directors/Mrs. Wendy Malm Board Secretary.png',
          description: 'Image of the Board Secretary',
          group: 'board'
        },
        {
          key: 'secretary_bio',
          label: 'Secretary Bio',
          type: 'html',
          fallback: 'Experienced professional ensuring effective board governance and compliance.',
          description: 'Biography of the Board Secretary',
          group: 'board'
        },
        // Functional Heads Section
        {
          key: 'functional_heads_title',
          label: 'Functional Heads Title',
          type: 'text',
          fallback: 'Functional Heads',
          description: 'Main title for Functional Heads section',
          group: 'functional'
        },
        {
          key: 'functional_heads_subtitle',
          label: 'Functional Heads Subtitle',
          type: 'text',
          fallback: 'Our functional leaders ensure operational excellence across all departments.',
          description: 'Subtitle for Functional Heads section',
          group: 'functional'
        },
        // Internal Auditor
        {
          key: 'auditor_name',
          label: 'Internal Auditor Name',
          type: 'text',
          fallback: 'Mr. Opoku Debrah',
          description: 'Name of the Internal Auditor',
          group: 'functional'
        },
        {
          key: 'auditor_title',
          label: 'Internal Auditor Title',
          type: 'text',
          fallback: 'Internal Auditor',
          description: 'Title of the Internal Auditor',
          group: 'functional'
        },
        {
          key: 'auditor_image',
          label: 'Internal Auditor Image',
          type: 'image',
          fallback: '/Functional Heads/Mr. Opoku Debrah (Internal Auditor).jpg',
          description: 'Image of the Internal Auditor',
          group: 'functional'
        },
        {
          key: 'auditor_bio',
          label: 'Internal Auditor Bio',
          type: 'html',
          fallback: 'Ensuring compliance and risk management across all organizational processes.',
          description: 'Biography of the Internal Auditor',
          group: 'functional'
        },
        {
          key: 'auditor_description',
          label: 'Internal Auditor Description',
          type: 'html',
          fallback: 'Responsible for internal audit functions, risk assessment, and ensuring compliance with regulatory requirements and internal policies.',
          description: 'Detailed description of Internal Auditor role and responsibilities',
          group: 'functional'
        },
        // Special Project
        {
          key: 'special_project_name',
          label: 'Special Project Name',
          type: 'text',
          fallback: 'Mr. Richard Ankrah',
          description: 'Name of the Special Project head',
          group: 'functional'
        },
        {
          key: 'special_project_title',
          label: 'Special Project Title',
          type: 'text',
          fallback: 'Special Project',
          description: 'Title of the Special Project head',
          group: 'functional'
        },
        {
          key: 'special_project_image',
          label: 'Special Project Image',
          type: 'image',
          fallback: '/Functional Heads/Mr. Richard Ankrah ( Special Project).jpg',
          description: 'Image of the Special Project head',
          group: 'functional'
        },
        {
          key: 'special_project_bio',
          label: 'Special Project Bio',
          type: 'html',
          fallback: 'Leading strategic initiatives and special projects to drive organizational growth.',
          description: 'Biography of the Special Project head',
          group: 'functional'
        },
        {
          key: 'special_project_description',
          label: 'Special Project Description',
          type: 'html',
          fallback: 'Oversees special projects and strategic initiatives that drive innovation and organizational development.',
          description: 'Detailed description of Special Project role and responsibilities',
          group: 'functional'
        },
        // Risk, Membership and Partnership
        {
          key: 'risk_membership_name',
          label: 'Risk Membership Name',
          type: 'text',
          fallback: 'Mr. Vitus Ninfaakang',
          description: 'Name of the Risk, Membership and Partnership head',
          group: 'functional'
        },
        {
          key: 'risk_membership_title',
          label: 'Risk Membership Title',
          type: 'text',
          fallback: 'Risk, Membership and Partnership',
          description: 'Title of the Risk, Membership and Partnership head',
          group: 'functional'
        },
        {
          key: 'risk_membership_image',
          label: 'Risk Membership Image',
          type: 'image',
          fallback: '/Functional Heads/Mr. Vitus Ninfaakang (Risk, Membership and Partnership).jpg',
          description: 'Image of the Risk, Membership and Partnership head',
          group: 'functional'
        },
        {
          key: 'risk_membership_bio',
          label: 'Risk Membership Bio',
          type: 'html',
          fallback: 'Managing risk assessment and building strategic partnerships with key stakeholders.',
          description: 'Biography of the Risk, Membership and Partnership head',
          group: 'functional'
        },
        {
          key: 'risk_membership_description',
          label: 'Risk Membership Description',
          type: 'html',
          fallback: 'Manages risk assessment, membership services, and strategic partnerships to ensure market stability and growth.',
          description: 'Detailed description of Risk, Membership and Partnership role and responsibilities',
          group: 'functional'
        },
        // Corporate Services
        {
          key: 'corporate_services_name',
          label: 'Corporate Services Name',
          type: 'text',
          fallback: 'Mrs. Jemimah Naa Adjeley Oppong-Gyamfi',
          description: 'Name of the Corporate Services head',
          group: 'functional'
        },
        {
          key: 'corporate_services_title',
          label: 'Corporate Services Title',
          type: 'text',
          fallback: 'Corporate Services',
          description: 'Title of the Corporate Services head',
          group: 'functional'
        },
        {
          key: 'corporate_services_image',
          label: 'Corporate Services Image',
          type: 'image',
          fallback: '/Functional Heads/Mrs. Jemimah Naa Adjeley Oppong-Gyamfi ( Corporate Services).jpg',
          description: 'Image of the Corporate Services head',
          group: 'functional'
        },
        {
          key: 'corporate_services_bio',
          label: 'Corporate Services Bio',
          type: 'html',
          fallback: 'Overseeing corporate governance and administrative excellence.',
          description: 'Biography of the Corporate Services head',
          group: 'functional'
        },
        {
          key: 'corporate_services_description',
          label: 'Corporate Services Description',
          type: 'html',
          fallback: 'Oversees corporate governance, administrative functions, and ensures compliance with corporate policies and procedures.',
          description: 'Detailed description of Corporate Services role and responsibilities',
          group: 'functional'
        },
        // Operations
        {
          key: 'operations_name',
          label: 'Operations Name',
          type: 'text',
          fallback: 'Mrs. Wendy Malm',
          description: 'Name of the Operations head',
          group: 'functional'
        },
        {
          key: 'operations_title',
          label: 'Operations Title',
          type: 'text',
          fallback: 'Operations',
          description: 'Title of the Operations head',
          group: 'functional'
        },
        {
          key: 'operations_image',
          label: 'Operations Image',
          type: 'image',
          fallback: '/Functional Heads/Mrs. Wendy Malm (Operations).jpg',
          description: 'Image of the Operations head',
          group: 'functional'
        },
        {
          key: 'operations_bio',
          label: 'Operations Bio',
          type: 'html',
          fallback: 'Ensuring smooth operational processes and service delivery excellence.',
          description: 'Biography of the Operations head',
          group: 'functional'
        },
        {
          key: 'operations_description',
          label: 'Operations Description',
          type: 'html',
          fallback: 'Manages day-to-day operations, ensures efficient service delivery, and maintains operational excellence across all departments.',
          description: 'Detailed description of Operations role and responsibilities',
          group: 'functional'
        },
        // Value Chain and Product Development
        {
          key: 'value_chain_name',
          label: 'Value Chain Name',
          type: 'text',
          fallback: 'Mr. Godfred Kofi Nyamekye',
          description: 'Name of the Value Chain and Product Development head',
          group: 'functional'
        },
        {
          key: 'value_chain_title',
          label: 'Value Chain Title',
          type: 'text',
          fallback: 'Value Chain and Product Development',
          description: 'Title of the Value Chain and Product Development head',
          group: 'functional'
        },
        {
          key: 'value_chain_image',
          label: 'Value Chain Image',
          type: 'image',
          fallback: '/Functional Heads/Mr. Godfred Kofi Nyamekye (Value Chain and Product Development).jpg',
          description: 'Image of the Value Chain and Product Development head',
          group: 'functional'
        },
        {
          key: 'value_chain_bio',
          label: 'Value Chain Bio',
          type: 'html',
          fallback: 'Driving innovation in product development and value chain optimization.',
          description: 'Biography of the Value Chain and Product Development head',
          group: 'functional'
        },
        {
          key: 'value_chain_description',
          label: 'Value Chain Description',
          type: 'html',
          fallback: 'Develops new products, optimizes value chains, and drives innovation to enhance market offerings and efficiency.',
          description: 'Detailed description of Value Chain and Product Development role and responsibilities',
          group: 'functional'
        },
        // Warehouse & Quality
        {
          key: 'warehouse_quality_name',
          label: 'Warehouse Quality Name',
          type: 'text',
          fallback: 'Mr. Gabriel Aryeetey',
          description: 'Name of the Warehouse & Quality head',
          group: 'functional'
        },
        {
          key: 'warehouse_quality_title',
          label: 'Warehouse Quality Title',
          type: 'text',
          fallback: 'Warehouse & Quality',
          description: 'Title of the Warehouse & Quality head',
          group: 'functional'
        },
        {
          key: 'warehouse_quality_image',
          label: 'Warehouse Quality Image',
          type: 'image',
          fallback: '/Functional Heads/Mr. Gabriel Aryeetey (Warehouse & Quality).jpg',
          description: 'Image of the Warehouse & Quality head',
          group: 'functional'
        },
        {
          key: 'warehouse_quality_bio',
          label: 'Warehouse Quality Bio',
          type: 'html',
          fallback: 'Maintaining quality standards and efficient warehouse operations.',
          description: 'Biography of the Warehouse & Quality head',
          group: 'functional'
        },
        {
          key: 'warehouse_quality_description',
          label: 'Warehouse Quality Description',
          type: 'html',
          fallback: 'Manages warehouse operations, quality control, and ensures proper storage and handling of commodities.',
          description: 'Detailed description of Warehouse & Quality role and responsibilities',
          group: 'functional'
        },
        // Information Technology and Information System
        {
          key: 'it_systems_name',
          label: 'IT Systems Name',
          type: 'text',
          fallback: 'Dr. Harold Okai-Tettey',
          description: 'Name of the IT and Information System head',
          group: 'functional'
        },
        {
          key: 'it_systems_title',
          label: 'IT Systems Title',
          type: 'text',
          fallback: 'Information Technology and Information System',
          description: 'Title of the IT and Information System head',
          group: 'functional'
        },
        {
          key: 'it_systems_image',
          label: 'IT Systems Image',
          type: 'image',
          fallback: '/Functional Heads/Dr. Harold Okai-Tettey ( Information Technology and Information System).jpg',
          description: 'Image of the IT and Information System head',
          group: 'functional'
        },
        {
          key: 'it_systems_bio',
          label: 'IT Systems Bio',
          type: 'html',
          fallback: 'Leading digital transformation and technology infrastructure development.',
          description: 'Biography of the IT and Information System head',
          group: 'functional'
        },
        {
          key: 'it_systems_description',
          label: 'IT Systems Description',
          type: 'html',
          fallback: 'Leads digital transformation, manages IT infrastructure, and ensures secure and efficient technology systems.',
          description: 'Detailed description of IT and Information System role and responsibilities',
          group: 'functional'
        },
        // Finance and Investments
        {
          key: 'finance_investments_name',
          label: 'Finance Investments Name',
          type: 'text',
          fallback: 'Mr. Albert Nii Ayi Tagoe',
          description: 'Name of the Finance and Investments head',
          group: 'functional'
        },
        {
          key: 'finance_investments_title',
          label: 'Finance Investments Title',
          type: 'text',
          fallback: 'Finance and Investments',
          description: 'Title of the Finance and Investments head',
          group: 'functional'
        },
        {
          key: 'finance_investments_image',
          label: 'Finance Investments Image',
          type: 'image',
          fallback: '/Functional Heads/Mr. Albert Nii Ayi Tagoe (Finance and Investments).jpg',
          description: 'Image of the Finance and Investments head',
          group: 'functional'
        },
        {
          key: 'finance_investments_bio',
          label: 'Finance Investments Bio',
          type: 'html',
          fallback: 'Managing financial strategy and investment opportunities for sustainable growth.',
          description: 'Biography of the Finance and Investments head',
          group: 'functional'
        },
        {
          key: 'finance_investments_description',
          label: 'Finance Investments Description',
          type: 'html',
          fallback: 'Manages financial planning, investment strategies, and ensures sound financial management and growth opportunities.',
          description: 'Detailed description of Finance and Investments role and responsibilities',
          group: 'functional'
        }
      ]
    },
    {
      pageId: 'homepage',
      title: 'Homepage',
      description: 'Content for the homepage sections',
      items: [
        {
          key: 'hero_title',
          label: 'Hero Title',
          type: 'text',
          fallback: 'Ghana Commodity Exchange',
          description: 'Main hero section title',
          group: 'hero'
        },
        {
          key: 'hero_subtitle',
          label: 'Hero Subtitle',
          type: 'text',
          fallback: 'Connecting Markets, Connecting People, Providing Opportunities',
          description: 'Hero section subtitle',
          group: 'hero'
        },
        {
          key: 'hero_description',
          label: 'Hero Description',
          type: 'html',
          fallback: 'A regulated market that links buyers and sellers of commodities to trade by Rules, while we assure the market quantity and quality, timely delivery and settlement.',
          description: 'Hero section description',
          group: 'hero'
        },
        {
          key: 'hero_cta_primary',
          label: 'Primary CTA Button',
          type: 'text',
          fallback: 'Explore Platform',
          description: 'Primary call-to-action button text',
          group: 'hero'
        },
        {
          key: 'hero_cta_secondary',
          label: 'Secondary CTA Button',
          type: 'text',
          fallback: 'Learn More',
          description: 'Secondary call-to-action button text',
          group: 'hero'
        }
      ]
    },
    {
      pageId: 'services',
      title: 'Services Page',
      description: 'Content for the services page',
      items: [
        {
          key: 'services_title',
          label: 'Services Title',
          type: 'text',
          fallback: 'Our Core Services',
          description: 'Main title for services section',
          group: 'services'
        },
        {
          key: 'services_subtitle',
          label: 'Services Subtitle',
          type: 'text',
          fallback: 'Ghana Commodity Exchange provides comprehensive trading solutions for agricultural commodities',
          description: 'Subtitle for services section',
          group: 'services'
        },
        {
          key: 'service_trading_title',
          label: 'Regulated Trading Title',
          type: 'text',
          fallback: 'Regulated Trading',
          description: 'Title for regulated trading service',
          group: 'services'
        },
        {
          key: 'service_trading_description',
          label: 'Regulated Trading Description',
          type: 'html',
          fallback: 'National and regional market linking buyers and sellers under established rules with transparent pricing and secure settlement.',
          description: 'Description for regulated trading service',
          group: 'services'
        },
        {
          key: 'service_price_title',
          label: 'Price Discovery Title',
          type: 'text',
          fallback: 'Price Discovery',
          description: 'Title for price discovery service',
          group: 'services'
        },
        {
          key: 'service_price_description',
          label: 'Price Discovery Description',
          type: 'html',
          fallback: 'Transparent price discovery mechanism ensuring competitive pricing for commodities through real-time market data.',
          description: 'Description for price discovery service',
          group: 'services'
        },
        {
          key: 'service_quality_title',
          label: 'Quality Assurance Title',
          type: 'text',
          fallback: 'Quality Assurance',
          description: 'Title for quality assurance service',
          group: 'services'
        },
        {
          key: 'service_quality_description',
          label: 'Quality Assurance Description',
          type: 'html',
          fallback: 'Assured market quantity and quality with timely delivery and settlement through rigorous standards.',
          description: 'Description for quality assurance service',
          group: 'services'
        }
      ]
    }
  ]

  // Migrate a single page content
  const migratePage = async (pageContent: PageContent) => {
    migrationStatus[pageContent.pageId] = 'pending'
    
    try {
      // Create content object from items
      const content: Record<string, string> = {}
      pageContent.items.forEach(item => {
        content[item.key] = item.fallback
      })

      // Try to save as page first
      const pageData = {
        title: pageContent.title,
        slug: pageContent.pageId,
        content: JSON.stringify(content),
        excerpt: pageContent.description,
        template: 'default',
        status: 'published',
        meta_title: `${pageContent.title} - GCX`,
        meta_description: pageContent.description,
        meta_keywords: pageContent.pageId,
        sort_order: 0
      }

      try {
        // Check if page exists
        const existingResponse = await axios.get(`/api/pages/${pageContent.pageId}`)
        if (existingResponse.data.page) {
          // Update existing page
          await axios.put(`/api/pages/id/${existingResponse.data.page.id}`, {
            ...existingResponse.data.page,
            content: JSON.stringify(content)
          })
          console.log(`✅ Updated existing page: ${pageContent.pageId}`)
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Create new page
          await axios.post('/api/pages', pageData)
          console.log(`✅ Created new page: ${pageContent.pageId}`)
        } else {
          throw err
        }
      }

      migrationStatus[pageContent.pageId] = 'success'
      return true
    } catch (err: any) {
      console.error(`❌ Failed to migrate ${pageContent.pageId}:`, err)
      migrationStatus[pageContent.pageId] = 'error'
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      return false
    }
  }

  // Migrate all content
  const migrateAllContent = async () => {
    loading.value = true
    error.value = null
    
    let successCount = 0
    let totalCount = pageContents.length

    for (const pageContent of pageContents) {
      const success = await migratePage(pageContent)
      if (success) successCount++
    }

    loading.value = false
    
    console.log(`Migration completed: ${successCount}/${totalCount} pages migrated successfully`)
    return { successCount, totalCount }
  }

  // Check migration status
  const checkMigrationStatus = async () => {
    for (const pageContent of pageContents) {
      try {
        const response = await axios.get(`/api/pages/${pageContent.pageId}`)
        migrationStatus[pageContent.pageId] = response.data.page ? 'success' : 'pending'
      } catch {
        migrationStatus[pageContent.pageId] = 'pending'
      }
    }
  }

  return {
    loading,
    error,
    migrationStatus,
    pageContents,
    migratePage,
    migrateAllContent,
    checkMigrationStatus
  }
}
