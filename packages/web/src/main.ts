// @ts-ignore
import './style.css'

const $textForm  = document.getElementById( 'form-text' ) as HTMLFormElement
const $imageForm = document.querySelector( '#form-image > form' ) as HTMLFormElement
const $svgForm   = document.getElementById( 'form-svg' ) as HTMLFormElement
const $resDiv    = document.getElementById( 'result' ) as HTMLPreElement
const $tabs      = document.querySelectorAll( '[role="tab"]' ) as NodeListOf<HTMLButtonElement>
const $tabPanels = document.querySelectorAll( '[role="tabpanel"]' ) as NodeListOf<HTMLDivElement>

$tabs.forEach( tab => {

	tab.addEventListener( 'click', () => {

		// Actualizar atributos de accesibilidad
		$tabs.forEach( t => {

			t.setAttribute( 'aria-selected', 'false' )
			t.setAttribute( 'tabindex', '-1' )
			t.classList.remove( 'is-active' )

		} )
		tab.setAttribute( 'aria-selected', 'true' )
		tab.setAttribute( 'tabindex', '0' )
		tab.classList.add( 'is-active' )

		// Mostrar solo el tabpanel correspondiente
		$tabPanels.forEach( panel => {

			panel.hidden = true
			panel.classList.add( 'is-hidden' )

		} )
		const panel  = document.getElementById( tab.getAttribute( 'aria-controls' ) )
		panel.hidden = false
		panel.classList.remove( 'is-hidden' )

	} )

} )

$imageForm.addEventListener( 'submit', async e => {

	e.preventDefault()

	const { image2ascii } = await import( '@ascii-kit/image' )
	const form            = e.target as HTMLFormElement
	const $fileInput      = form.querySelector( 'input[type="file"]' ) as HTMLInputElement
	const file            = $fileInput.files?.[0]

	if ( !file ) {

		alert( 'Por favor selecciona una imagen.' )
		return

	}

	const arrayBuffer = await file.arrayBuffer()
	const uint8       = new Uint8Array( arrayBuffer )
	const res         = await image2ascii( uint8 )

	$resDiv.textContent = res

} )

$textForm.addEventListener( 'submit', async e => {

	e.preventDefault()

} )

$svgForm.addEventListener( 'submit', async e => {

	e.preventDefault()

} )
