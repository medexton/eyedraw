<?php
/**
 * OpenEyes.
 *
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.openeyes.org.uk
 *
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright 2011-2017, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0
 */

/**
 * Language specific doodle descriptions (used for title attributes of doodle toolbar buttons).
 *
 * @author Bill Aylward <bill.aylward@openeyes.org>
 *
 * @version 0.9
 */
class DoodleInfo
{
    /**
     * @static array
     */
    public static $titles = array(
        'NONE' => 'No description available for this doodle',
        'ACIOL' => 'Anterior chamber IOL',
        'ACMaintainer' => 'AC maintainer',
        'AdnexalEye' => 'Adnexal eye template',
        'AngleGrade' => 'Angle grade',
        'AngleGradeEast' => 'Angle Grade East',
        'AngleGradeNorth' => 'Angle Grade North',
        'AngleGradeSouth' => 'Angle Grade South',
        'AngleGradeWest' => 'Angle Grade West',
        'AngleNV' => 'Angle new vessels',
        'AngleRecession' => 'Angle recession',
        'AntPVR' => 'Anterior PVR',
        'AntSeg' => 'Anterior segment',
        'AntSegAngleMarks' => 'Angle Marks',
        'AntSynech' => 'Anterior synechiae',
        'APattern' => 'A pattern',
        'ArcuateKeratotomy' => 'Arcuate keratotomy',
        'ArcuateScotoma' => 'Arcuate scotoma',
        'Arrow' => 'Arrow',
        'BiopsySite' => 'Biopsy site',
        'Bleb' => 'Trabeculectomy bleb',
        'BlotHaemorrhage' => 'Blot haemorrhage',
        'Buckle' => 'Buckle',
        'BuckleOperation' => 'Buckle operation',
        'BuckleSuture' => 'Buckle suture',
        'BusaccaNodule' => 'Busacca nodule',
        'CapsularTensionRing' => 'Capsular Tension Ring',
        'ChandelierDouble' => 'Double chandelier',
        'ChandelierSingle' => 'Chandelier',
        'ChoroidalHaemorrhage' => 'Choroidal haemorrhage',
        'ChoroidalNaevus' => 'Choroidal naevus',
        'CiliaryInjection' => 'Cilary injection',
        'Circinate' => 'Circinate retinopathy',
        'CircumferentialBuckle' => 'Circumferential buckle',
        'CNV' => 'Choroidal new vessels',
        'ConjunctivalFlap' => 'Conjunctival flap',
        'ConjunctivalSuture' => 'Conjunctival suture',
        'Conjunctivitis' => 'Conjunctivitis',
        'CornealAbrasion' => 'Corneal abrasion',
        'CornealEpithelialDefect' => 'Corneal epithelial defect',
        'CornealErosion' => 'Removal of corneal epithelium',
        'CornealGraft' => 'Corneal graft',
        'CornealInlay' => 'Corneal inlay',
        'CornealOedema' => 'Corneal oedema',
        'CornealOpacity' => 'Corneal opacity',
        'CornealPigmentation' => 'Corneal pigmentation',
        'CornealScar' => 'Corneal scar',
        'CornealStriae' => 'Corneal striae',
        'CornealSuture' => 'Corneal suture',
        'CorticalCataract' => 'Cortical cataract',
        'CottonWoolSpot' => 'Cotton wool spot',
        'Cryo' => 'Cryotherapy scar',
        'CutterPI' => 'Cutter iridectomy',
        'Cypass' => 'Cypass Stent Insertion',
        'CystoidMacularOedema' => 'Cystoid macular oedema',
        'DendriticUlcer' => 'Dendritic ulcer',
        'DiabeticNV' => 'Retinal neovascularisation',
        'Dialysis' => 'Dialysis',
        'DiscHaemorrhage' => 'Disc haemorrhage',
        'DiscPallor' => 'Disc pallor',
        'DrainageRetinotomy' => 'Drainage retinotomy',
        'DrainageSite' => 'Drainage site',
        'EncirclingBand' => 'Encircling band',
        'EntrySiteBreak' => 'Entry site break',
        'EpiretinalMembrane' => 'Epiretinal membrane',
        'Episcleritis' => 'Episcleritis',

        'FibrousProliferation' => 'Fibrous proliferation',
        'FibrovascularScar' => 'Fibrovascular Scar',
        'FocalLaser' => 'Focal laser',
        'Freehand' => 'Freehand drawing',
        'Fuchs' => 'Guttata',
        'Fundus' => 'Fundus',
        'Geographic' => 'Geographic atrophy',
        'Gonioscopy' => 'Gonioscopy',
        'GRT' => 'Giant retinal tear',
        'HardDrusen' => 'Hard drusen',
        'HardExudate' => 'Hard exudate',
        'Hyphaema' => 'Hyphaema',
        'Hypopyon' => 'Hypopyon',
        'IatrogenicBreak' => 'IatrogenicBreak',
        'ILMPeel' => 'ILM peel',
        'ICL' => 'Implantable Collamer Lens',
        'IOL' => 'Intraocular lens',
        'InjectionSite' => 'Injection site',
        'InnerLeafBreak' => 'Inner leaf break',
        'Iris' => 'Iris',
        'IrisHook' => 'Iris hook',
        'IrisNaevus' => 'Iris naevus',
        'IRMA' => 'Intraretinal microvascular abnormalities',
        'KeraticPrecipitates' => 'Keratic precipitates',
        'KoeppeNodule' => 'Koeppe nodule',
        'KrukenbergSpindle' => 'Krukenberg spindle',
        'Label' => 'Label',
        'LaserCircle' => 'Circle of laser photocoagulation',
        'LaserDemarcation' => 'Laser demarcation',
        'LasikFlap' => 'LASIK flap',
        'LaserSpot' => 'Laser spot',
        'Lattice' => 'Lattice',
        'Lens' => 'Lens',
        'LimbalRelaxingIncision' => 'Limbal relaxing incision',
        'Macroaneurysm' => 'Macroaneurysm',
        'MacularDystrophy' => 'Macular dystrophy',
        'MacularGrid' => 'Macular grid laser',
        'MacularHole' => 'Macular hole',
        'MacularThickening' => 'Macular thickening',
        'Malyugin' => 'Malyugin ring',
        'MattressSuture' => 'Mattress suture',
        'Microaneurysm' => 'Microaneurysm',
        'NerveFibreDefect' => 'Nerve fibre defect',
        'NuclearCataract' => 'Nuclear cataract',
        'OpticCup' => 'Optic cup',
        'OpticDisc' => 'Optic disc',
        'OpticDiscPit' => 'Optic disc pit',
        'OrthopticEye' => 'Orthoptic eye',
        'OuterLeafBreak' => 'Outer leaf break',
        'PalpebralConjunctivitis' => 'Palpebral Conjunctivitis',
        'Papilloedema' => 'Papilloedema',
        'Patch' => 'Tube patch',
        'PCIOL' => 'Posterior chamber IOL',
        'PeripapillaryAtrophy' => 'Peripapillary atrophy',
        'PeripheralRetinectomy' => 'Peripheral retinectomy',
        'PhakoIncision' => 'Phako incision',
        'PI' => 'Peripheral iridectomy',
        'PointInLine' => 'Point in line',
        'PosteriorCapsule' => 'Posterior capsule',
        'PosteriorEmbryotoxon' => 'Posterior embryotoxon',
        'PostPole' => 'Posterior pole',
        'PostSubcapCataract' => 'Posterior subcapsular cataract',
        'PosteriorRetinectomy' => 'Posterior retinectomy',
        'PosteriorSynechia' => 'Posterior synechia',
        'PreRetinalHaemorrhage' => 'Pre-retinal haemorrhage',
        'PRP' => 'Panretinal photocoagulation',
        'PRPPostPole' => 'Panretinal photocoagulation (posterior pole)',
        'PTK' => 'Phototherapeutic keratectomy',
        'Pupil' => 'Pupil',
        'RadialSponge' => 'Radial sponge',
        'RetinalArteryOcclusionPostPole' => 'Retinal artery occlusion',
        'RetinalHaemorrhage' => 'Retinal haemorrhage',
        'RetinalTouch' => 'Retinal touch',
        'RetinalVeinOcclusionPostPole' => 'Retinal vein occluson',
        'Retinoschisis' => 'Retinoschisis',
        'RK' => 'Radial keratotomy',
        'RoundHole' => 'Round hole',
        'RPEAtrophy' => 'RPE Atrophy',
        'RPEDetachment' => 'RPE detachment',
        'RPEHypertrophy' => 'RPE Hypertrophy',
        'RPERip' => 'RPE rip',
        'RRD' => 'Rhegmatogenous retinal detachment',
        'Rubeosis' => 'Rubeosis iridis',
        'SectorPRP' => 'Sector PRP',
        'SectorPRPPostPole' => 'Sector PRP (posterior pole)',
        'ScleralIncision' => 'Scleral Incision',
        'Sclerostomy' => 'Sclerostomy',
        'SectorIridectomy' => 'Sector iridectomy',
        'Shading' => 'Shading',
        'SidePort' => 'Side port',
        'Slider' => 'Slider',
        'SMILE' => 'Small incision lenticule extraction',
        'SPEE' => 'SPEE',
        'StarFold' => 'Star fold',
        'STFB' => 'STFB',
        'SubretinalFluid' => 'Subretinal fluid',
        'SubretinalPFCL' => 'Subretinal PFCL',
        'Supramid' => 'Supramid suture',
        'SwollenDisc' => 'Swollen disc',
        'Telangiectasis' => 'Parafoveal telangiectasia',
        'Trabectome' => 'Trabectome',
        'TrabyConjIncision' => 'Trabeculectomy conjunctival incision',
        'TrabyFlap' => 'Trabeculectomy flap',
        'TrabySuture' => 'Trabeculectomy suture',
        'ToricPCIOL' => 'Toric posterior chamber IOL',
        'TractionRetinalDetachment' => 'Traction retinal detachment',
        'TransilluminationDefect' => 'Transillumination defect',
        'Tube' => 'Drainage tube',
        'TubeExtender' => 'Tube extender',
        'TubeLigation' => 'Ligation suture',
        'UpDrift' => 'Up drift',
        'UpShoot' => 'Up shoot',
        'UTear' => 'Traction ‘U’ tear',
        'Vicryl' => 'Vicryl suture',
        'ViewObscured' => 'View obscured',
        'VitreousOpacity' => 'Vitreous opacity',
        'VPattern' => 'V pattern',
        'Crepitations' => 'Crepitations',
        'Stenosis' => 'Stenosis',
        'Wheeze' => 'Wheeze',
        'Effusion' => 'Pleural effusion',
        'LeftCoronaryArtery' => 'Left coronary artery',
        'DrugStent' => 'Drug eluting stent',
        'MetalStent' => 'Metal stent',
        'Bypass' => 'Coronary artery bypass',
        'Bruit' => 'Bruit',
        'Bruising' => 'Bruising',
        'Haematoma' => 'Haematoma',
        'AdenoviralKeratitis' => 'Adenoviral keratitis',
        'MarginalKeratitis' => 'Marginal keratitis',
        'CornealLaceration' => 'Corneal laceration',
        'MetallicForeignBody' => 'Metallic foreign body',
        'Pingueculum' => 'Pingueculum',
        'Pterygium' => 'Pterygium',
        'Drusen' => 'Drusen',
        'MaculaPostPole' => 'Macula (posterior pole)',
        'PCV' => 'Polypoidal choroidal vasculopathy',
    );
}
